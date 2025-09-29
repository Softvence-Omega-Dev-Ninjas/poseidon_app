import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return {
      scope: ['email', 'profile'],
      state: request.query.from, // dynamically pass state
    };
  }
}

// import { AuthGuard } from '@nestjs/passport';
// import { ExecutionContext } from '@nestjs/common';

// export class GoogleAuthGuard extends AuthGuard('google') {
//   async canActivate(context: ExecutionContext) {
//     const request = context.switchToHttp().getRequest();
//     console.log('from guard: ', request.query); // we get data here... but how can i pass it on my strategy validate va

//     if (request.query.from) {
//       (request.query as any).state = request.query.from;
//     }

//     return (await super.canActivate(context)) as boolean;
//   }
// }
