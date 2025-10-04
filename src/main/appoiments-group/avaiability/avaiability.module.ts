import { Module } from '@nestjs/common';
import { AvailabilityRepository } from './avaiability.repository';

@Module({ imports: [], providers: [AvailabilityRepository], exports: [] })
export class AvaiabilityModule {}
