import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { LangchainModule } from "src/langchain/langchain.module";
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
})
export class ProductsModule { }

