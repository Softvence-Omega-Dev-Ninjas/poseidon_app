import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsSignInInfo } from './dto/create-auth.dto';
import { CreateUserDto } from 'src/main/user/dto/create-user.dto';
import { AuthUserService } from 'src/main/user/user-auth-info/authUser.service';
import { Response } from 'express';

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
  async signin(
    @Body() createAuthDto: CredentialsSignInInfo,
    @Res() res: Response,
  ) {
    const userDto = await this.authUserService.loginUser(createAuthDto);
    const varifyUser = await this.authService.userCredentialsAuthentication(
      userDto,
      createAuthDto.password,
    );
    res.cookie('accessToken', varifyUser.access_token);
    return res.status(HttpStatus.OK).json(varifyUser);
  }
}
