import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { join } from "path";
import { ProductsService } from "src/products/products.service";

/**
 * Service for scheduling tasks that automate certain operations, such as importing product data.
 *
 * This service uses decorators and dependency injection provided by NestJS to schedule and
 * execute tasks at specified intervals. It is designed to work within a NestJS application
 * and is marked as injectable, allowing it to be easily integrated and used across the application.
 *
 * @class SchedulerService
 */
export class SchedulerService {
    constructor(private readonly productsService: ProductsService) { }

    /**
     * Schedules a task to handle daily import of product data from a vendor.
     * This example uses a cron job scheduled to run every day.
     * This method calls the `processCSV` method of the `ProductsService` to process the data.
     * 
     */
    // @Cron(CronExpression.EVERY_5_SECONDS)
    async handleDailyImport() {
        const filePath = process.env.PRODUCTS_CSV_FILE_URL || join(__dirname, '../../data/products.csv');
        const performDeletion = process.env.PERFORM_DELETION === 'true' ? true : false;
        await this.productsService.processCSV(filePath, performDeletion);
    }
}