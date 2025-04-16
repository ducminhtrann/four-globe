import { Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import {
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from "./user.entity";
import { Comment } from "./comment.entity";

@Entity({ name: 'posts' })
export class Post {
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

    @Column({type: 'varchar'})
    title: string

    @Column({type: 'text'})
    content: string

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[]

    @ManyToOne(() => User)
    user: User

    constructor(data?: Partial<Post>) {
        if(data) {
            this.id = data?.id as number;
            this.title = data?.title as string;
            this.content = data?.content as string;
            this.user = data?.user as User;
        }
    }
}