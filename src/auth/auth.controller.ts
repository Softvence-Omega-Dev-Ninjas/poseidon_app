import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsSignInInfo } from './dto/create-auth.dto';
import { UserService } from 'src/main/user/user.service';
import { CreateUserDto } from 'src/main/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  signup(@Body() createAuthDto: CreateUserDto) {
    return this.userService.createUser(createAuthDto);
  }
  @Post('signin')
  signin(@Body() createAuthDto: CredentialsSignInInfo) {
    return createAuthDto;
  }
}
