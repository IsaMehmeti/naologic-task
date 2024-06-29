import { Module } from '@nestjs/common';
import { SchedulerModule } from './scheduler/scheduler.module';
import { LangchainModule } from './langchain/langchain.module';

@Module({
  imports: [SchedulerModule, LangchainModule]
})
export class AppModule { }
