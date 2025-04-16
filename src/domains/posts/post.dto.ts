import { IsNotEmpty, IsNumber, IsOptional, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreatePostDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        example: "Title of Post",
        description: "Title of Post",
        required: true
    })
    title: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        example: "Content of Post",
        description: "Content of Post",
        required: true
    })
    content: string
}

export class UpdatePostDTO extends CreatePostDTO {}

export class CommentOnPostDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        example: "Content of Comment",
        required: true
    })
    content: string
}

export class QueryPaginationDTO {
    @IsOptional()
    @ApiProperty({
        type: Number,
        description: "Num of Page",
        required: false,
        default: 1
    })
    @Type(() => Number)
    page: number

    @IsOptional()
    @ApiProperty({
        type: Number,
        description: "Total items per page",
        required: false,
        default: 10
    })
    @Type(() => Number)
    per_page: number
}
