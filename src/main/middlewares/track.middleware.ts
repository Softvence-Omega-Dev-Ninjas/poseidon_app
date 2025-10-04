import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { getClientIp } from 'src/utils/ip';

@Injectable()
export class TrackVisitMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: any, _: any, next: () => void) {
    const ip = getClientIp(req); // Get the IP address

    if (ip) {
      try {
        const today = new Date(); // Get current date and time
        const visitDate = new Date(
          Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate(),
            0,
            0,
            0,
            0,
          ),
        ); // Normalize to the start of the day in UTC (00:00:00.000Z)
        // TODO(coderboysobuj) implements catching system to get faster respone

        // Check user exits with ip
        let visitor = await this.userService.existingVisitor(ip, visitDate);

        if (!visitor) {
          const country = await this.userService.getCountryFromIP(ip);
          await this.userService.trackVisit(ip, country, visitDate);
        } else {
        }
      } catch (error: any) {
        console.log('Error: getCountryFromIP() ', error);
      }
    }

    next();
  }
}
