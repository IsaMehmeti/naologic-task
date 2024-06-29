import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ProductsService } from "src/products/products.service";

@Injectable()
export class SchedulerService {
    constructor(private readonly productsService: ProductsService) { }

    //cron for every day 
    @Cron(CronExpression.EVERY_5_SECONDS)
    async handleDailyImport() {
        await this.productsService.proccessCSV('csvfile.csv');
    }
}