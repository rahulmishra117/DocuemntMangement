import { Entity ,PrimaryGeneratedColumn ,Column } from "typeorm";
@Entity('auth')
export class Auth{
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({unique:true})
    email: string;

    @Column()
    password: string;

    @Column({ default :()=> 'CURRENT_TIMESTAMP'})
    created_at: Date;

}