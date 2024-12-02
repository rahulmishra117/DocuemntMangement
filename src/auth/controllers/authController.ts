import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { authRegisterDto } from '../dtos/authRegisterDto.dto';
import { AuthService } from '../services/authService';
import { Auth } from '../entities/auth-entity';
import { Response } from 'express'; // Import Response type

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // Register endpoint
    @Post('/register')
    async register(@Body() authRegisterData: authRegisterDto): Promise<{ status: number; data: Auth }> {
        try {
            console.log('Received register data:', authRegisterData);
            const registerData = await this.authService.register(authRegisterData);
            console.log('User registered successfully:', registerData);

            return {
                status: HttpStatus.OK,
                data: registerData,
            };
        } catch (error) {
            console.error('Error during registration:', error.message);
            throw error; // Ensure errors are handled by a global exception filter
        }
    }

    // Login endpoint
    @Post('/login')
    async login(@Body() authRegisterData: authRegisterDto, @Res() res: Response): Promise<any> {
        try {
            // Call login service method to get the token
            const token = await this.authService.login(authRegisterData);

            // Return response with token
            return res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                token: token,
            });
        } catch (error) {
            console.error('Error during login:', error.message);
            return res.status(HttpStatus.UNAUTHORIZED).json({
                status: HttpStatus.UNAUTHORIZED,
                message: 'Invalid credentials',
            });
        }
    }

    @Post('/logout')
    async logout(@Res() res: Response): Promise<void> {
        try {
            // Here you can handle any cleanup or token invalidation logic if needed
            res.clearCookie('auth_token'); // If you're using cookies to store the JWT token
            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'User logged out successfully',
            });
        } catch (error) {
            console.error('Error during logout:', error.message);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Logout failed',
            });
        }
    }

}
