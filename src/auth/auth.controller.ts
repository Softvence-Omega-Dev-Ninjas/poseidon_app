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
  ValidationPipe,
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
import { StringToBooleanPipe } from 'src/common/utils/stringToBoolean.pipe';
import { CheckVarifyEmail, VarifyEmailDto } from './dto/varify.dto';

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
    @Body('skip', StringToBooleanPipe) skip: boolean,
    @Body() createAuthDto: SignUpUserDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    // call cloudinary profile image upload - this area
    const { imageUrl } = await this.cloudinaryService.profileImageUpload(image);
    const {
      skip: skipAuth,
      role,
      username,
      email,
      password,
      referralId,
      ...profile
    } = createAuthDto;

    console.log('skip ------------+++', skip);

    return this.authUserService.createUser(
      {
        role,
        email,
        username,
        password,
        profile: {
          ...profile,
          image: imageUrl,
        },
        referralId,
      },
      skip,
    );
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
    res.cookie('accessToken', varifyUser.access_token, {
      httpOnly: true, // cannot be accessed via JS
      secure: true, // set true if using HTTPS
      sameSite: 'none', // allow cross-site
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      // partitioned: true,
    });
    return res.status(HttpStatus.OK).json(varifyUser);
  }

  @Public()
  @Get('check/:username')
  async checkUsername(@Param('username') username: string) {
    return this.authUserService.checkUsername(username);
  }

  @Public()
  @Get('check-jwt/:token')
  async checkJwt(@Param('token') token: string) {
    return this.authService.checkJwt(token);
  }

  @Public()
  @Post('varify-email')
  varifyemail(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    data: VarifyEmailDto,
  ) {
    return this.authService.varifyemail(data);
  }

  @Public()
  @Post('checkVarifyEmail')
  checkVarifyEmail(@Body() data: CheckVarifyEmail) {
    return this.authService.checkVarifyEmail(data);
  }
}

// auth.service.ts
// async signup(dto: CreateUserDto, referralCode?: string) {
//   const newUser = await this.prisma.user.create({
//     data: {
//       username: dto.username,
//       email: dto.email,
//       password: dto.password, // hash করতে ভুলো না
//       referredBy: referralCode || null,
//     },
//   });

//   // যদি referralCode থাকে তাহলে Referral টেবিলে রেকর্ড তৈরি করো
//   if (referralCode) {
//     await this.referralService.createReferral(referralCode, newUser.id);
//   }

//   return newUser;
// }
