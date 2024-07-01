import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { LangchainModule } from "src/langchain/langchain.module";
import { ProductsController } from "./products.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "./schemas/product.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
        ]),
        LangchainModule],
    providers: [ProductsService],
    exports: [ProductsService],
    controllers: [ProductsController]
})
export class ProductsModule { }

