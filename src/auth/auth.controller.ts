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
  HttpException,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsSignInInfo } from './dto/create-auth.dto';
import { AuthUserService } from 'src/main/user/user-auth-info/authUser.service';
import type { Response } from 'express';
import { Public } from './guard/public.decorator';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/common/utils/image-validation.pipe';
import { SignUpUserDto } from './dto/signup-auth.dto';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { StringToBooleanPipe } from 'src/common/utils/stringToBoolean.pipe';
import {
  CheckVarifyEmail,
  ForgetPasswordCodeCheck,
  ForgetPasswordSendEmail,
  ForgetPasswordToken,
  VarifyEmailDto,
} from './dto/varify.dto';
import { cResponseData } from 'src/common/utils/common-responseData';
import { CreateLoginDto, RefDto } from './dto/create-or-login';
import { AuthHandlerService } from './auth-handler/service';
import { cookieHandler } from 'src/common/utils/cookie-handler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authUserService: AuthUserService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly authHandlerService: AuthHandlerService,
  ) {}

  @Public()
  @Post('signup')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: SignUpUserDto })
  async signup(
    @Body('skip', StringToBooleanPipe) skip: boolean,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
    @Body(new ValidationPipe()) createAuthDto: SignUpUserDto,
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

    console.log('skip ------------+++', skipAuth);

    console.log({
      role,
      email,
      username,
      password,
      profile: {
        ...profile,
        image: imageUrl,
      },
      referralId,
    });

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
    @Body(new ValidationPipe()) createAuthDto: CredentialsSignInInfo,
    @Res() res: Response,
  ) {
    if (!createAuthDto.email || !createAuthDto.password) {
      throw new HttpException(
        cResponseData({
          message: 'Email and password are required',
          error: null,
          data: null,
          success: false,
        }),
        HttpStatus.BAD_REQUEST,
      );
    }

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
  // chack DB user email

  @Public()
  @Get('check-email/:email')
  async checkEmail(@Param('email') email: string) {
    const checkEmail = await this.authUserService.isExestUser(email);
    if (checkEmail) {
      return {
        message: 'Email already exists',
        success: false,
      };
    }
    return {
      message: 'Ok',
      success: true,
    };
  }

  // signup varify email

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

  // change password

  @Public()
  @Post('forget-password')
  async forgetPassword(@Body() data: ForgetPasswordSendEmail) {
    const isExestUser = await this.authUserService.isExestUser(data.email);
    if (!isExestUser) {
      throw new HttpException(
        cResponseData({
          message: 'User not found',
          error: null,
          data: null,
          success: false,
        }),
        HttpStatus.NOT_FOUND,
      );
    }
    return this.authService.forgetPasswordGenaredCode(data);
  }

  @Public()
  @Post('forget-password-varify')
  async forgetPasswordVarify(@Body() data: ForgetPasswordCodeCheck) {
    return this.authService.checkForgetPasswordCode(data);
  }

  @Public()
  @Post('change-password')
  async changePassword(@Body() data: ForgetPasswordToken) {
    return this.authService.changePassword(data);
  }

  @Public()
  @Post('create-login-ref')
  async createLoginRef(
    @Res() response: Response,
    @Body() body: CreateLoginDto,
    @Query() query?: RefDto,
  ) {
    try {
      const res = await this.authHandlerService.store(body, query);
      cookieHandler(response, 'set', res?.access_token);
      return response.status(HttpStatus.OK).json(res);
    } catch (err: any) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message || 'something went wrong!' });
    }
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
