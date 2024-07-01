import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class OptionValue {
    @Prop()
    id: string;

    @Prop()
    name: string;

    @Prop()
    value: string;
}

@Schema()
export class Option extends Document {
    @Prop()
    id: string;

    @Prop()
    name: string;

    @Prop([OptionValue])
    values: OptionValue[];
}
