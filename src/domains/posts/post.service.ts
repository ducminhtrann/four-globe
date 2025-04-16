import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "src/entities/post.entity";
import { FindOneOptions, FindOptionsSelect, Repository } from "typeorm";
import { CommentOnPostDTO, CreatePostDTO, QueryPaginationDTO, UpdatePostDTO } from "./post.dto";
import { getSkipTake } from "src/helpers";
import { User } from "src/entities/user.entity";
import { Comment } from "src/entities/comment.entity";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly _postRepository: Repository<Post>,
        @InjectRepository(Comment)
        private readonly _commentRepository: Repository<Comment>
    ) { }

    public async create(dto: CreatePostDTO, user: User): Promise<Post> {
        const post = new Post(dto);
        post.user = user;
        return await this._postRepository.save(post)
    }

    public async list(dto: QueryPaginationDTO) {
        const { skip, take } = getSkipTake(dto);
        const [items, total] = await this._postRepository.findAndCount({
            skip, take,
            relations: {
                user: true
            },
            select: this._selectPosts(),
            order: {
                updated_at: 'DESC'
            }
        })
        return { items, total }
    }

    public async update(id: number, dto: UpdatePostDTO, user: User): Promise<Post> {
        const post = await this._assertPostByUser(id, user);
        const entity = new Post({ ...post, ...dto });
        return await this._postRepository.save(entity)
    }

    public async details(id: number): Promise<Post> {
        const post = await this._postRepository.findOne({
            where: { id },
            relations: {
                user: true,
                comments: {
                    user: true
                }
            },
            select: this._selectPost()
        })
        return post as Post;
    }

    public async delete(id: number, user: User) {
        await this._assertPostByUser(id, user);
        await this._postRepository.delete({ id });
    }

    public async commentOnPost(postId: number, content: string, user: User) {
        const post = await this._assertPostById(postId)
        const comment = new Comment({ content });
        comment.post = post;
        comment.user = user;
        return await this._commentRepository.save(comment);
    }

    private async _assertPostById(id: number): Promise<Post> {
        const post = await this._postRepository.findOneBy({ id })
        if (!post) {
            throw new BadRequestException("Post not found!");
        }
        return post;
    }

    private async _assertPostByUser(postId: number, user: User): Promise<Post> {
        const post = await this._postRepository.findOne({
            where: {
                id: postId,
                user
            }
        });
        if (!post) {
            throw new BadRequestException("Cannot action on this post!")
        }
        return post;
    }

    private _selectPosts(): FindOneOptions<Post>['select'] {
        return {
            id: true,
            title: true,
            content: true,
            created_at: true,
            updated_at: true,
            user: this._selectUser()
        }
    }

    private _selectPost(): FindOneOptions<Post>['select'] {
        return {
            ...this._selectPosts(),
            comments: {
                id: true,
                content: true,
                created_at: true,
                updated_at: true,
                user: this._selectUser()
            }
        }
    }

    private _selectUser(): FindOptionsSelect<User> {
        return {
            id: true,
            username: true
        }
    }
}