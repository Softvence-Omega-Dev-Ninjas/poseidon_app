import { ApiProperty } from '@nestjs/swagger';
// import { CreateUserDto } from 'src/main/user/dto/create-user.dto';

// export class CreateCredentialsUserDto extends CreateUserDto {}

export class CredentialsSignInInfo {
  @ApiProperty({
    required: true,
    example: 'user@gmail.com',
  })
  email: string;
  @ApiProperty({
    required: true,
    example: 'User345@#$',
  })
  password: string;
}

type profileDto = {
  name: string;
  image: string;
};

export class authenticationUserDto {
  id: string;
  provider: string;
  email: string;
  password?: string | null;
  role: string;
  profile?: profileDto | null;
  shop?: { id: string } | null;
  memberships_owner?: { id: string } | null;
  stripeAccountId?: string | null;
}
