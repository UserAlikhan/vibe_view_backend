import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { createClerkClient } from '@clerk/backend';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async login(data: { email: string; username?: string; password: string, attempts: number }) {
    const user = await this.usersService.findByEmail(data.email);

    // If the user has attempted to login more than 5 times, 
    // lock the user in Clerk for 1 hour
    if (data.attempts >= 5) {
      if (user) {
        await createClerkClient({
          secretKey: process.env.CLERK_SECRET_KEY,
          publishableKey: process.env.CLERK_PUBLISHABLE_KEY
        }).users.lockUser(user.clerk_id);

        return {
          isLocked: true,
        };
      } else {
        throw new UnauthorizedException('User not found');
      }
    }

    const lowerCaseUsername = data.username 
      ? data.username?.toLocaleLowerCase() 
      : null;

    if (user?.isGoogleAccount && user?.username !== lowerCaseUsername) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      username: lowerCaseUsername,
      email: data.email,
      isGoogleAccount: user.isGoogleAccount,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registrationDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(
      registrationDto.email,
    );

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    
    registrationDto.username = registrationDto.username 
      ? registrationDto.username.toLocaleLowerCase() 
      : null;

    console.log("registrationDto", registrationDto)

    return await this.usersService.create(registrationDto);
  }
}
