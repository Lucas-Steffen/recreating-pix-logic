import { Injectable } from '@nestjs/common';
import { normalizeValue, tokenizeName } from 'src/shared/utils/normalize.util';
import { KmsService } from './kms.service';

@Injectable()
export class BlindIndexService {
  constructor(private readonly kmsService: KmsService) {}

  async computeExactIndex(value: string): Promise<string> {
    return this.kmsService.generateMac(normalizeValue(value));
  }

  async computeTokenIndexes(value: string): Promise<string[]> {
    const tokens = tokenizeName(value);
    return Promise.all(tokens.map((token) => this.kmsService.generateMac(token)));
  }
}
