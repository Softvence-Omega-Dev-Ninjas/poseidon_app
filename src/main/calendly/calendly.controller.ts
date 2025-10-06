import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { CalendlyService } from './calendly.service';
import {
  CreateCalendlyEventDto,
  UpdateCalendlyEventDto,
} from './dto/create-event.dto';
import { Public } from 'src/auth/guard/public.decorator';
import { ApiParam } from '@nestjs/swagger';
import { CalendlyWebhook } from './calendly.webhook';
import { GlobalMailService } from 'src/common/mail/global-mail.service';
import { Response } from 'express';

@Controller('calendly')
export class CalendlyController {
  protected resData: any;
  constructor(
    private readonly service: CalendlyService,
    private readonly webhook: CalendlyWebhook,
    private readonly mailService: GlobalMailService,
  ) {}

  // IMPORTANT WEB-HOOK ENDPOINT
  @Public()
  @Post('invite')
  async handleInvite(
    @Res() res: Response,
    @Body() payload: any,
    @Headers('x-calendly-signature') signature: string,
  ) {
    console.log('Webhook received:', payload);
    console.log('invitees:', payload.invitees_counter);
    console.log('memberships: ', payload.event_memberships);
    console.log('membershipobject: ', payload.event_memberships[0]);
    console.log('location: ', payload.location);
    this.resData = payload;
    console.log('sig', signature);

    await this.mailService.sendMail(
      [
        'devlopersabbir@gmail.com',
        'srka780@gmail.com',
        'coderboysobuj@gmail.com',
      ],
      'web hook',
      'none',
      { data: JSON.stringify(payload) },
    );
    // return res.redirect(`${process.env.LIVE_BACKEND_URL}/calendly`);
    return payload;
  }

  @Public()
  @Get()
  async redd() {
    return this.resData;
  }
  // IMPORTANT WEB-HOOK ENDPOINT

  // OPTIONAL // -> this is only one time
  @Public()
  @Post('create-webhook')
  async createWebHook() {
    try {
      const hook = await this.webhook.CreateWebHookSubcription();
      return hook;
    } catch (err) {
      return err;
    }
  }
  @Public()
  @Get('web-hooks')
  async getWebhooks() {
    try {
      const hook = await this.webhook.GetWebHooks();
      return hook;
    } catch (err) {
      return err;
    }
  }

  // OPTIONAL //

  @Public()
  @Post('create-event-type')
  async handleCreate(@Body() body: CreateCalendlyEventDto) {
    try {
      const event = await this.service.createEvent(body);
      return event;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Public()
  @ApiParam({ name: 'uuid', required: true, type: String })
  @Get('events-types/:uuid')
  async getEvent(@Param('uuid') uuid: string) {
    try {
      const event = await this.service.getEventById(uuid);
      return event;
    } catch (err) {
      return err;
    }
  }

  @Public()
  @ApiParam({ name: 'uuid', required: true, type: String })
  @Patch('event-types/:uuid')
  async updateEvent(
    @Param('uuid') uuid: string,
    @Body() body: UpdateCalendlyEventDto,
  ) {
    try {
      const event = await this.service.updateEventType(uuid, body);
      return event;
    } catch (err) {
      return err;
    }
  }
  @Public()
  @Get('events-collections')
  async getEvents() {
    try {
      const event = await this.service.getEventCollections();
      return event;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
  @Public()
  @Get('redireact')
  async oauthRedicreat(@Param() param: any) {
    console.log(param);
    return 'hello';
  }

  @Public()
  @Get('me')
  async index() {
    try {
      const user = await this.service.getme();
      return user;
    } catch (err) {
      return err;
    }
  }
}
