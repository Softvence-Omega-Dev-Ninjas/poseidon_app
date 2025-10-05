import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import {
  CalendlyEvent,
  CalendlyEventCollection,
  CalendlyPayload,
  MakeRequired,
} from './types/calendly.types';
import { defaultCalendlyPayload } from './constants';
import { slugify } from 'src/auth/auth-handler/utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CalendlyService {
  private CALENDLY_API = 'https://api.calendly.com';
  private AUTH_HEADER = {};

  constructor(private readonly config: ConfigService) {
    this.AUTH_HEADER = {
      Authorization: `Bearer ${this.config.getOrThrow<string>('CALENDLY_PERSONAL_ACCESS_TOKEN')}`,
      'Content-Type': 'application/json',
    };
  }

  async createEvent(input: CalendlyPayload) {
    if (!input.name || !input.duration)
      throw new BadRequestException('name and duration required');

    // Step 1: Get authenticated user (to assign event under their profile)
    // const uri = await this.getme();
    const uri = this.config.getOrThrow<string>('CALENDLY_AUTH_URI');

    // check event already has or not if already has then no need to create event type
    const collections = await this.getEventCollections(uri); // list of collections of the system admin
    const payload = this.generatePayload({ ...input, owner: uri }); // generate payload
    this.isEventExist(collections, { ...payload, slug: payload.slug! }); // if evnet is already exist then throw error

    // Step 2: Create event type
    const { data } = await axios.post(
      `${this.CALENDLY_API}/event_types`,
      payload,
      {
        headers: this.AUTH_HEADER,
      },
    );
    console.log('data: ', data);
    return {
      message: 'Event type created successfully',
      event: data.resource, // we jsut need scheduling_url <-> resource.scheduling_url
    };
  }

  private async getme<T extends string>(): Promise<T> {
    // need to store me in redis db
    const { data } = await axios.get(`${this.CALENDLY_API}/users/me`, {
      headers: this.AUTH_HEADER,
    });
    const uri = data.resource.uri;
    if (!uri)
      throw new InternalServerErrorException('Fail to retrive system auth');
    return uri as T;
  }

  async getEventCollections<T = CalendlyEventCollection['collection']>(
    uri: string,
  ): Promise<T> {
    const { data } = await axios.get(
      `${this.CALENDLY_API}/event_types?user=${uri}`,
      {
        headers: this.AUTH_HEADER,
      },
    );

    return data.collection ?? [];
  }

  private isEventExist(
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

  private generatePayload(
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
