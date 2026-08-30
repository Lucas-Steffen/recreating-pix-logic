import { Module } from '@nestjs/common';
import { KmsService } from './kms.service';
import { BlindIndexService } from './blind-index.service';

@Module({
  providers: [KmsService, BlindIndexService],
  exports: [KmsService, BlindIndexService],
})
export class KmsModule {}
