import { Module } from '@nestjs/common';
import { KmsService } from './kms.service';

@Module({
  providers: [KmsService]
})
export class KmsModule {}
