import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class TrackVisitMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: any, res: any, next: () => void) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Get the IP address

    // Track the visit
    const visitUser = await this.userService.trackVisit(ip);

    next();
  }
}
