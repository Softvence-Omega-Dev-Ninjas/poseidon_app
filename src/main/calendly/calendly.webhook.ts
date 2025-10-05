import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CalendlyService } from './calendly.service';
import { ConfigService } from '@nestjs/config';
import { axios } from './utils';

@Injectable()
export class CalendlyWebhook extends CalendlyService {
  protected readonly BACKEND_URL: string;
  protected readonly CALENDLY_WEB_HOOK: string;
  protected readonly CALENDLY_ORG_URI: string;

  constructor(config: ConfigService) {
    super(config);
    this.BACKEND_URL =
      this.config.get('NODE_ENV') !== 'production'
        ? this.config.getOrThrow('BACKEND_URL')
        : this.config.getOrThrow('LIVE_BACKEND_URL');
    this.CALENDLY_WEB_HOOK = this.config.getOrThrow('CALENDLY_WEB_HOOK');
    this.CALENDLY_ORG_URI = this.config.getOrThrow('CALENDLY_ORG_URI');
  }

  //   create web hook subscription
  async CreateWebHookSubcription() {
    const payload = this.requestBody();

    const { data } = await axios.post('/webhook_subscriptions', payload);
    if (!data.resource)
      throw new InternalServerErrorException('Fail to create web hooks');
    return data.resource;
  }

  async GetWebHooks() {
    const { data } = await axios.get(
      `/webhook_subscriptions?scope=user&user=${this.CALENDLY_AUTH_URI}&organization=${this.CALENDLY_ORG_URI}`,
    );

    return data.collection;
  }

  private requestBody() {
    const obj = {
      url: `${this.BACKEND_URL}/calendly/invite`,
      organization: this.CALENDLY_ORG_URI,
      user: this.CALENDLY_AUTH_URI,
      events: [
        'invitee.created',
        'invitee.canceled',
        'invitee_no_show.created',
        'invitee_no_show.deleted',
      ],
      scope: 'user',
      signing_key: this.CALENDLY_WEB_HOOK,
    };
    return obj;
  }
}
