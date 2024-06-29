import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { LangchainModule } from "src/langchain/langchain.module";

@Module({
    imports: [LangchainModule],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule { }