import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class OneTimeSchedulerUtil {
  private readonly logger = new Logger(OneTimeSchedulerUtil.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  scheduleOneTimeJob(jobName: string, executeAt: Date, callback: () => void) {
    const now = new Date();
    const delay = executeAt.getTime() - now.getTime();

    if (delay <= 0) {
      this.logger.warn(`Job "${jobName}" time is in the past. Skipping.`);
      return;
    }

    if (this.schedulerRegistry.doesExist('timeout', jobName)) {
      this.logger.warn(`Job "${jobName}" already exists.`);
      return;
    }

    const timeout = setTimeout(() => {
      this.logger.log(`Executing one-time job: "${jobName}"`);
      callback();
      this.schedulerRegistry.deleteTimeout(jobName);
    }, delay);

    this.schedulerRegistry.addTimeout(jobName, timeout);
    this.logger.log(
      `Scheduled one-time job "${jobName}" to run in ${delay / 1000} seconds.`,
    );
  }

  cancelJob(jobName: string) {
    if (this.schedulerRegistry.doesExist('timeout', jobName)) {
      this.schedulerRegistry.deleteTimeout(jobName);
      this.logger.log(`Cancelled job "${jobName}"`);
    } else {
      this.logger.warn(`Job "${jobName}" not found`);
    }
  }
}

//how to used that

// import { Injectable } from '@nestjs/common';
// import { OneTimeSchedulerUtil } from 'src/utils/one-time-scheduler.util';

// @Injectable()
// export class RefundService {
//   constructor(private readonly oneTimeScheduler: OneTimeSchedulerUtil) {}

//   scheduleRefund(orderId: string, refundTime: Date) {
//     const jobName = `auto-refund-${orderId}`;

//     this.oneTimeScheduler.scheduleOneTimeJob(
//       jobName,
//       refundTime,
//       () => this.processRefund(orderId),
//     );
//   }

//   private async processRefund(orderId: string) {
//     // Your actual refund logic
//     console.log(`Processing refund for order ${orderId}`);
//     // Example: await this.prisma.order.update({ ... });
//   }
// }
