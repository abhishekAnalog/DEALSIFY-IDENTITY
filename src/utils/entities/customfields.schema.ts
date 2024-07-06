import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class CustomFields extends Document {
  @Prop({ index: true, required: true })
  label: string;

  @Prop({ index: false, required: true })
  labelSlug: string;

  @Prop({ index: false, required: false })
  defaultValue: string;

  @Prop({ index: false, required: true, default: false })
  isRequired: boolean;
}

export const customFieldSchema = SchemaFactory.createForClass(CustomFields);
