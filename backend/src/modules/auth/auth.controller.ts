import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/**
 * Authentication Controller
 * 
 * Handles authentication endpoints (login, register).
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * POST /auth/login
     * Authenticate user and return JWT token
     */
    @ApiOperation({ summary: 'User login', description: 'Authenticate with email and password' })
    @ApiResponse({ status: 200, description: 'Login successful, returns access token' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiBody({ type: LoginDto })
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    /**
     * POST /auth/register
     * Create new user account
     */
    @ApiOperation({ summary: 'User registration', description: 'Create a new user account' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input or user already exists' })
    @ApiBody({ type: RegisterDto })
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
}
