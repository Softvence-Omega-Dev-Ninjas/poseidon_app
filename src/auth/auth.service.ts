import { Injectable } from '@nestjs/common';
import { authenticationUserDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  authenticationUser(user: authenticationUserDto | null) {
    return user;
  }
}
