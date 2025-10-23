import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
// import { CreateUserDto } from 'src/main/user/dto/create-user.dto';

// export class CreateCredentialsUserDto extends CreateUserDto {}

export class CredentialsSignInInfo {
  @ApiProperty({
    required: true,
    example: 'user@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, {
    message: 'Invalid email format',
  })
  email: string;

  @ApiProperty({
    required: true,
    example: 'User345@#$',
  })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @Matches(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|:;"'<>,.?/~`]).{6,}$/,
    {
      message:
        'Password must be 6-15 characters long, include at least 1 uppercase letter, 1 number, and 1 special character',
    },
  )
  password: string;
}

type profileDto = {
  name: string;
  image?: string | null;
};

export class authenticationUserDto {
  id: string;
  provider: string;
  username: string;
  email: string;
  password?: string | null;
  role: string;
  profile?: profileDto | null;
  shop?: { id: string } | null;
  memberships_owner?: { id: string } | null;
  stripeAccountId?: string | null;
  varify: boolean;
}
