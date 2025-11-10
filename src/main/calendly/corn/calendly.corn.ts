import { Cron, CronExpression } from '@nestjs/schedule';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CalendlyWebhook } from '../calendly.webhook';
import { WebhookSubscription } from '../types/webhooks';
import { extractSubscriptionId } from '../utils';

@Injectable()
export class CalendlyCornJob {
  private readonly logger = new Logger(CalendlyCornJob.name);
  constructor(private readonly webhook: CalendlyWebhook) {}

  // the cron job will execute every 5 hours
  @Cron(CronExpression.EVERY_5_HOURS)
  // @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCronJob() {
    this.logger.log('Cron job is running');
    // TODO: Delete existing webhooks
    const webhoooks: Awaited<WebhookSubscription[]> =
      await this.webhook.GetWebHooks(); // collect all webhooks that already created
    for (const webhook of webhoooks) {
      // Delete all webhooks that are already created before
      const webhookId = extractSubscriptionId(webhook.uri);
      if (!webhookId)
        throw new InternalServerErrorException(
          'Fail to extract webhook subscrition id',
        );
      await this.webhook.DeleteWebHook(webhookId); // delete the webhook with the webhook id
    }

    // TODO: Create new one with the same name
    await this.webhook.CreateWebHookSubcription();
    this.logger.log('New webhook created');
  }
}
