import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from 'src/main/user/dto/create-user.dto';

export class CreateCredentialsUserDto extends CreateUserDto {}

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
