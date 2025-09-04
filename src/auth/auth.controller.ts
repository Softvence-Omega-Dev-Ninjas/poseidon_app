import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsSignInInfo } from './dto/create-auth.dto';
import { AuthUserService } from 'src/main/user/user-auth-info/authUser.service';
import { Response } from 'express';
import { Public } from './guard/public.decorator';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/common/utils/image-validation.pipe';
import { SignUpUserDto } from './dto/signup-auth.dto';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authUserService: AuthUserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Public()
  @Post('signup')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: SignUpUserDto })
  async signup(
    @Body() createAuthDto: SignUpUserDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    // call cloudinary profile image upload - this area
    const { imageUrl } = await this.cloudinaryService.profileImageUpload(image);
    const { role, email, password, ...profile } = createAuthDto;

    return this.authUserService.createUser({
      role,
      email,
      password,
      profile: {
        ...profile,
        image: imageUrl,
      },
    });
  }

  @Public()
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

  @Public()
  @Get('check-jwt/:token')
  async checkJwt(@Param('token') token: string) {
    return this.authService.checkJwt(token);
  }
}
