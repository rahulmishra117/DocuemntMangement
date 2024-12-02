import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from './controllers/authController';
import { AuthService } from './services/authService';
import { AuthRepo } from './repositories/authRepo';
import { Auth } from './entities/auth-entity';
import { JwtService } from './jwt/jwt.service';
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([Auth]),
        JwtModule.register({
            secret: 'rahulmdoc',
            signOptions: { expiresIn: '1h' },  // Configure JWT expiration time
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthRepo, JwtService],
    exports: [AuthService],
})
export class AuthModule {}
