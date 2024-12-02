import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Auth } from '../entities/auth-entity';

@Injectable()
export class AuthRepo {
    constructor(
        @InjectRepository(Auth)
        private readonly authRepo: Repository<Auth>
    ) {}

    async createUser(obj: Partial<Auth>): Promise<Auth> {
        const newUser = this.authRepo.create(obj);
        return await this.authRepo.save(newUser);
    }
    async findUserByEmail(email: string): Promise<Auth | null> {
        return this.authRepo.findOne({ where: { email } }); // Fetch user by email
    }
}
