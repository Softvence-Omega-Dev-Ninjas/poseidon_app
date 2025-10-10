import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoCallSchedulHistoryDto } from './create-video-call-schedul-history.dto';

export class UpdateVideoCallSchedulHistoryDto extends PartialType(CreateVideoCallSchedulHistoryDto) {}
