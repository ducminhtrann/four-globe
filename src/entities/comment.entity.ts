import { Entity, JoinColumn, ManyToOne } from "typeorm";
import {
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from "./user.entity";
import { Post } from "./post.entity";

@Entity({ name: 'comments' })
export class Comment {
    @PrimaryGeneratedColumn()
    id?: number;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    public created_at: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    public updated_at: Date;

    @Column({type: 'text'})
    content: string

    @ManyToOne(() => User)
    user: User

    @ManyToOne(() => Post)
    post: Post

    constructor(data?: Partial<Comment>) {
        if(data) {
            this.content = data?.content as string;
            this.user = data?.user as User;
            this.post = data?.post as Post;
        }
    }
}