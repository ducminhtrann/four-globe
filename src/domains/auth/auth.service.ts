import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { comparePassword, hashPassword } from 'src/helpers';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

const EXPIRE_SECONDS = 60 * 60 * 5;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  public async register(dto: RegisterDTO): Promise<void> {
    await this.assertUserExists(dto.username);
    dto.password = hashPassword(dto.password);
    await this.userRepository.save(dto);
  }

  public async login(dto: LoginDTO): Promise<string> {
    const user = await this.assertLoginUser(dto.username);
    this.assertPassword(dto.password, user.password);
    return this.generateAccessToken(user);
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload = {
      id: user.id,
      username: user.username
    }
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: EXPIRE_SECONDS,
    });
    return accessToken;
  }

  private assertPassword(password: string, dbPassword: string) {
    const isMatched = comparePassword(password, dbPassword);
    if (!isMatched) {
      throw new BadRequestException("Incorrect password!");
    }
  }

  private async assertLoginUser(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username })
    if (!user) {
      throw new BadRequestException("Invalid credentials!")
    }
    return user as User;
  }

  private async assertUserExists(username: string): Promise<void> {
    const user = await this.userRepository.exists({ where: {username} });
    if (user) {
      throw new BadRequestException("Username have been used!");
    }
  }
}
