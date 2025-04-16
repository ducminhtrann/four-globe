import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtSvc: JwtService) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const authorizationRequiredMsg = "Authentication required!"
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1] as string;
    if (!token) {
      throw new HttpException(authorizationRequiredMsg, HttpStatus.UNAUTHORIZED);
    }
    try {
      const user = await this.jwtSvc.verifyAsync<User>(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = new User(user);
      return true;
    } catch (error) {
      throw new HttpException(authorizationRequiredMsg, HttpStatus.UNAUTHORIZED);
    }
  }
}
