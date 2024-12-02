import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { authRegisterDto } from '../dtos/authRegisterDto.dto';
import { AuthRepo } from '../repositories/authRepo';
import { Auth } from '../entities/auth-entity';
import { JwtService } from '@nestjs/jwt';  // Import JwtService
import * as bcrypt from 'bcryptjs'; // Import bcrypt for password comparison

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name); // Provide context for the logger

    constructor(
        private readonly authRepo: AuthRepo,
        private readonly jwtService: JwtService, // Inject JwtService
    ) {}

    // Registration logic
    async register(registerData: authRegisterDto): Promise<Auth> {
        try {
            this.logger.log(`Registering user with data: ${JSON.stringify(registerData)}`);
            const { email, password } = registerData;

            // Create a new user and hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await this.authRepo.createUser({ email, password: hashedPassword });
            this.logger.log(`User registered successfully with email: ${email}`);

            return newUser;
        } catch (err) {
            this.logger.error(`Error while registering user: ${err.message}`, err.stack);
            throw err; // Rethrow the error so the controller or higher layers can handle it
        }
    }

    // Login logic
    async login(loginData: authRegisterDto): Promise<string> {
        try {
            this.logger.log(`Attempting to login with email: ${loginData.email}`);
            const { email, password } = loginData;

            // Find user by email
            const user = await this.authRepo.findUserByEmail(email);
            if (!user) {
                this.logger.warn(`No user found with email: ${email}`);
                throw new UnauthorizedException('Invalid credentials');
            }

            // Compare the hashed password with the input password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                this.logger.warn(`Invalid password attempt for email: ${email}`);
                throw new UnauthorizedException('Invalid credentials');
            }

            // Generate JWT token
            const payload = { email: user.email, userId: user.id };
            const token = this.jwtService.sign(payload);
            this.logger.log(`User logged in successfully with email: ${email}`);

            return token;
        } catch (err) {
            this.logger.error(`Error while logging in user: ${err.message}`, err.stack);
            throw err;
        }
    }
}
