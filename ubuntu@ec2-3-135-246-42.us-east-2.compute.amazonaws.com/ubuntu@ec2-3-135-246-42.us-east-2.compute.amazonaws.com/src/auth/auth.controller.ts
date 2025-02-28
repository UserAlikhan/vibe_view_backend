import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async signIn(
    @Body() signInData: { email: string; username: string; password: string },
  ) {
    return await this.authService.login(signInData);
  }

  @Post('registration')
  async registration(@Body() registrationDto: CreateUserDto) {
    return await this.authService.register(registrationDto);
  }
}
