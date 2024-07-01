import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Variant } from './variant.schema';
import { Option } from './option.schema';

@Schema()
export class ProductData extends Document {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    vendorId: string;

    @Prop()
    manufacturerId: string;

    @Prop()
    variants: Variant[];

    @Prop()
    options: Option[];

    @Prop()
    categoryId: string;

    @Prop()
    isFragile: boolean;

    @Prop()
    isTaxable: boolean;
}

@Schema()
export class ProductInfo extends Document {
    @Prop()
    createdBy: string;

    @Prop()
    createdAt: string;

    @Prop()
    updatedBy: string;

    @Prop()
    updatedAt: string;

    @Prop()
    deletedBy: string;

    @Prop()
    deletedAt: string;

    @Prop()
    dataSource: string;

    @Prop()
    companyStatus: string;

    @Prop()
    transactionId: string;

    @Prop()
    skipEvent: boolean;

    @Prop()
    userRequestId: string;
}

@Schema()
export class Product extends Document {
    @Prop()
    _id: string;

    @Prop()
    productId: number;

    @Prop()
    docId: string;

    @Prop({ default: null })
    fullData: string;

    @Prop({ type: ProductData })
    data: ProductData;

    @Prop({ type: Object, default: {} })
    dataPublic: any;

    @Prop({ default: false })
    immutable: boolean;

    @Prop({ default: 'd8039' })
    deploymentId: string;

    @Prop({ default: 'item' })
    docType: string;

    @Prop({ default: 'items' })
    namespace: string;

    @Prop({ default: '' })
    companyId: string;

    @Prop()
    status: string;

    @Prop({ type: ProductInfo })
    info: ProductInfo;
}

export const ProductSchema = SchemaFactory.createForClass(Product);