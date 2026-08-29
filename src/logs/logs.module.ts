import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsSubscriber } from './models/logs.subscriber';
import { Logs } from './models/entity/logs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Logs])],
    providers: [LogsService, LogsSubscriber],
    exports: [LogsService]
})
export class LogsModule {}
