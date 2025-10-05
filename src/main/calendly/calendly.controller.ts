import { Body, Controller, Get, Post } from '@nestjs/common';
import { CalendlyService } from './calendly.service';
import { CreateCalendlyEventDto } from './dto/create-event.dto';
import { Public } from 'src/auth/guard/public.decorator';

@Controller('calendly')
export class CalendlyController {
  constructor(private readonly service: CalendlyService) {}

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
  @Get('events-collections')
  async getEvents() {
    try {
      const event = await this.service.getEventCollections(
        'https://api.calendly.com/users/e59e9c05-97c6-42a4-8378-36ea32772384',
      );
      return event;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
