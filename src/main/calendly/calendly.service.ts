import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CalendlyEvent,
  CalendlyEventCollection,
  CalendlyPayload,
  MakeRequired,
} from './types/calendly.types';
import { defaultCalendlyPayload } from './constants';
import { slugify } from 'src/auth/auth-handler/utils';
import { ConfigService } from '@nestjs/config';
import { UpdateCalendlyEventDto } from './dto/create-event.dto';
import { axios } from './utils';

@Injectable()
export class CalendlyService {
  protected CALENDLY_AUTH_URI: string;

  constructor(protected readonly config: ConfigService) {
    this.CALENDLY_AUTH_URI = config.getOrThrow('CALENDLY_AUTH_URI');
  }

  public async createEvent(input: CalendlyPayload) {
    if (!input.name || !input.duration)
      throw new BadRequestException('Event name and duration is required');

    // const uri = await this.getme();
    const uri = this.config.getOrThrow<string>('CALENDLY_AUTH_URI');

    // check event already has or not if already has then no need to create event type
    const collections = await this.getEventCollections(uri); // list of collections of the system admin
    const payload = this.generatePayload({ ...input, owner: uri }); // generate payload
    this.isEventExist(collections, { ...payload, slug: payload.slug! }); // if evnet is already exist then throw error

    // create event
    const { data } = await axios.post(`/event_types`, payload);
    return {
      message: 'Event type created successfully',
      event: data.resource, // we jsut need scheduling_url <-> resource.scheduling_url
    };
  }

  public async getEventById(uuid: string) {
    if (!uuid) throw new NotFoundException('Event uuid is required!');

    const { data } = await axios.get(`/event_types/${uuid}`);
    return data;
  }

  public async updateEventType(uuid: string, input: UpdateCalendlyEventDto) {
    if (!uuid) throw new NotFoundException('Event uuid is required!');

    const { data } = await axios.put(`/event_types/${uuid}`, { ...input });
    return data;
  }
  public async getme<T extends object>(): Promise<T> {
    // need to store me in redis db
    const { data } = await axios.get(`/users/me`);
    console.log(data.resource);
    const { uri, current_organization } = data.resource;
    if (!uri || !current_organization)
      throw new InternalServerErrorException('Fail to retrive system auth');
    return { uri, current_organization } as T;
  }

  async getEventCollections<T = CalendlyEventCollection['collection']>(
    uri?: string,
  ): Promise<T> {
    const url = uri ?? this.CALENDLY_AUTH_URI;
    const { data } = await axios.get(`/event_types?user=${url}`);

    return data.collection ?? [];
  }

  protected isEventExist(
    collections: CalendlyEvent[],
    payload: MakeRequired<CalendlyPayload, 'slug'>,
  ) {
    for (const event of collections) {
      if (event.slug === payload.slug)
        throw new ConflictException(
          'Event already exist please choice diffrent event name or time.',
        );
    }
  }

  protected extractEventUUID(url: string) {
    return url.split('/').pop() as string;
  }

  protected generatePayload(
    input: MakeRequired<CalendlyPayload, 'owner'>,
  ): CalendlyPayload {
    const slug = input.username
      ? slugify(input.username)
      : input.name
        ? slugify(input.name)
        : '';

    const payload: CalendlyPayload = {
      name: `${input.name} - ${input.duration} Minutes`,
      slug: `${slug}-${input.duration}`,
      owner: input.owner,
      timezone: input.timezone ?? defaultCalendlyPayload.timezone,
      //   optional
      description: input.description ?? defaultCalendlyPayload.description,
      active: input.active ?? defaultCalendlyPayload.active,
      duration: input.duration ?? defaultCalendlyPayload.duration,
      kind: input.kind ?? defaultCalendlyPayload.kind,
      locale: input.locale ?? defaultCalendlyPayload.locale,
      locations: input.locations ?? defaultCalendlyPayload.locations,
      visibility: input.visibility ?? defaultCalendlyPayload.visibility,
      scheduling_url: input.visibility ?? defaultCalendlyPayload.visibility,
    };

    return payload;
  }
}
