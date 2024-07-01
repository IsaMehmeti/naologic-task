import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Variant extends Document {
    @Prop()
    _id: string;

    @Prop()
    id: string;

    @Prop()
    available: boolean;

    @Prop({ type: Object })
    attributes: {
        packaging: string;
        description: string;
    };

    @Prop()
    cost: number;

    @Prop()
    currency: string;

    @Prop()
    description: string;

    @Prop()
    manufacturerItemCode: string;

    @Prop()
    manufacturerItemId: string;

    @Prop()
    packaging: string;

    @Prop()
    price: number;

    @Prop()
    optionName: string;

    @Prop()
    optionsPath: string;

    @Prop()
    optionItemsPath: string;

    @Prop()
    sku: string;

    @Prop()
    active: boolean;

    @Prop()
    images: { fileName: string; cdnLink: string; alt: string }[];

    @Prop()
    itemCode: string;
}
