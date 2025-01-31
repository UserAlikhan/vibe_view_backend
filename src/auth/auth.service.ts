import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async login(data: { email: string; username: string; password: string }) {
    const user = await this.usersService.findByEmail(data.email);
    if (user?.email !== data.email || user?.username !== data.username) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      username: data.username,
      email: data.email,
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

    return await this.usersService.create(registrationDto);
  }
}
