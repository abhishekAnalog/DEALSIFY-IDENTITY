import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type modulesDocument = HydratedDocument<Modules>;

@Schema({
  collection: 'Modules',
})
export class Modules {
  @Prop({ unique: true, required: true })
  ModuleName: string;
}

export const ModulesSchema = SchemaFactory.createForClass(Modules);
