import { Injectable } from "@nestjs/common";
import { LangChainService } from "src/langchain/langchain.service";

@Injectable()
export class ProductsService {
    constructor(private readonly langChainService: LangChainService) { }

    async proccessCSV(filePath: string) {
        console.log('Processing CSV file...');
        // await this.langChainService.enhanceDescription('Hello World');
    }
}