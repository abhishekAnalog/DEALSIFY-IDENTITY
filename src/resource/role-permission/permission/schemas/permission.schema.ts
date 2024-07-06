import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type permissionDocument = HydratedDocument<Permission>;

@Schema({
    collection: 'Permission',
})
export class    Permission {
    @Prop({ unique: true, required: true })
    ModuleName: string;

}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
