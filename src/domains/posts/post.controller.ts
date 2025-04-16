import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard, AuthUser } from '../auth';
import { CommentOnPostDTO, CreatePostDTO, QueryPaginationDTO, UpdatePostDTO } from './post.dto';
import { PostService } from './post.service';
import { User } from 'src/entities/user.entity';

@Controller('posts')
@ApiTags('Posts')
export class PostController {
    constructor(private readonly _postService: PostService) { }

    @Post()
    @ApiOperation({ summary: 'Create Post' })
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    public async createProduct(
        @Body() body: CreatePostDTO,
        @Res() res: Response,
        @AuthUser() user: User,
    ) {
        const data = await this._postService.create(body, user);
        res.status(HttpStatus.CREATED).send({ data });
    }

    @Post(':id/comments')
    @ApiOperation({ summary: 'Comment on Post' })
    @ApiBearerAuth()
    @ApiParam({
        name: 'id',
        required: true,
        type: String,
    })
    @UseGuards(AuthGuard)
    public async comment(
        @AuthUser() user: User,
        @Param('id') postId: string,
        @Res() res: Response,
        @Body() body: CommentOnPostDTO,
    ) {
        const data = await this._postService.commentOnPost(+postId, body.content, user);
        res.status(HttpStatus.OK).send({
            data
        });
    }

    @Get()
    @ApiOperation({ summary: 'Get Posts With Pagination' })
    public async getProducts(
        @Query() query: QueryPaginationDTO,
        @Res() res: Response,
    ) {
        const { items: data, total } = await this._postService.list(query);
        res.status(HttpStatus.OK).send({
            data,
            total,
            page: query.page,
            per_page: query.per_page,
        });
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update Post' })
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    public async update(
        @Param('id') postId: string,
        @Body() body: UpdatePostDTO,
        @Res() res: Response,
        @AuthUser() user: User,
    ) {
        const data = await this._postService.update(+postId, body, user);
        res.status(HttpStatus.OK).send({ data });
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete Post' })
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    public async delete(
        @Param('id') postId: string,
        @Res() res: Response,
        @AuthUser() user: User,
    ) {
        await this._postService.delete(+postId, user);
        res.status(HttpStatus.OK).send({ message: 'ok' });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Detail Post with Comments' })
    public async details(
        @Param('id') postId: string,
        @Res() res: Response,
    ) {
        const data = await this._postService.details(+postId);
        res.status(HttpStatus.OK).send({ data });
    }
}
