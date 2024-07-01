import { Module } from '@nestjs/common';
import { SchedulerModule } from './scheduler/scheduler.module';
import { LangchainModule } from './langchain/langchain.module';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService, ConfigModule } from '@nestjs/config';



@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL') + '/' + configService.get<string>('MONGODB_DATABASE'),
      }),
      inject: [ConfigService],
    }),
    SchedulerModule,
    LangchainModule,
    ProductsModule
  ],
})
export class AppModule { }
