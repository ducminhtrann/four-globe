import { Entity } from "typeorm";
import {
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
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
    username: string

    @Column({type: 'varchar'})
    password: string

    constructor(data?: Partial<User>
    ) {
        if(data) {
            this.username = data?.username as string;
            this.password = data?.password as string
        }
    }
}