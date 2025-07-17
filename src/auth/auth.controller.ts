import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsSignInInfo } from './dto/create-auth.dto';
import { CreateUserDto } from 'src/main/user/dto/create-user.dto';
import { AuthUserService } from 'src/main/user/user-auth-info/authUser.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authUserService: AuthUserService,
  ) {}

  @Post('signup')
  signup(@Body() createAuthDto: CreateUserDto) {
    return this.authUserService.createUser(createAuthDto);
  }
  @Post('signin')
  signin(@Body() createAuthDto: CredentialsSignInInfo) {
    return createAuthDto;
  }
}
