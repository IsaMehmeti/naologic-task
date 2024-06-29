import { Module } from "@nestjs/common";
import { SchedulerService } from "./scheduler.service";
import { ScheduleModule } from "@nestjs/schedule";
import { ProductsModule } from "src/products/products.module";


@Module({
    imports: [ScheduleModule.forRoot(), ProductsModule],
    providers: [SchedulerService],
})
export class SchedulerModule { }