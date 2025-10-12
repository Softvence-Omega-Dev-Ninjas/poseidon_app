import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Req,
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
import { Request, Response } from 'express';
import { CalendlyWebhookPayload } from './types/webhookPayload';
import { SchedulService } from './schedul.service';

@Controller('calendly')
export class CalendlyController {
  protected resData: any;
  constructor(
    private readonly service: CalendlyService,
    private readonly webhook: CalendlyWebhook,
    private readonly mailService: GlobalMailService,
    private readonly schedulService: SchedulService,
  ) {}

  // IMPORTANT WEB-HOOK ENDPOINT
  @Public()
  @Post('invite')
  async handleInvite(
    @Req() req: Request,
    @Res() res: Response,
    @Body() payload: any, //CalendlyWebhookPayload
    // @Headers('x-calendly-signature') signature: string,
  ) {
    // console.log('query: ', req.query);
    // console.log('params: ', req.params);
    this.resData = payload;
    // console.log('payload: ------->>> ', payload);
    // console.log('===============================');
    // console.log('payload: ------->>> ', JSON.stringify(payload, null, 2));
    // console.log('===============================');
    console.log('payload out look: ------->>> ', payload);
    // console.log('===============================');
    // console.log('sig', signature);

    await this.schedulService.setSchedulSystem(payload);

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
      // console.log('web hook payload', hook);
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

  @Public()
  @Post('create-event-type')
  async handleCreate(@Body() body: CreateCalendlyEventDto) {
    try {
      const event = await this.service.createEvent(body);
      return event;
    } catch (err) {
      // console.log(err);
      return err;
    }
  }
  // OPTIONAL //

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
      // console.log(err);
      return err;
    }
  }

  @Public()
  @Get('redireact')
  async oauthRedicreat(@Param() param: any) {
    // console.log(param);
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
