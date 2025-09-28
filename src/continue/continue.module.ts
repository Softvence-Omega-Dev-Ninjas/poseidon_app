import { Module } from '@nestjs/common';
import { ContinueController } from './continue.controller';
import { ContinueService } from './continue.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TwitterStrategy } from './strategies/x.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: 'this_is_a_secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [ContinueController],
  providers: [
    ContinueService,
    TwitterStrategy,
    GoogleStrategy,
    FacebookStrategy,
  ],
})
export class ContinueModule {}
