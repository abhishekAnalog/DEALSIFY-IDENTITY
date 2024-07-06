import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Role } from '../../roles/schemas/roles.schema';
import { Permission } from '../../permission/schemas/permission.schema';

export type rolesPermissionMappingDocument = HydratedDocument<RolesPermissionMapping>;

@Schema({
    collection: 'RolesPermissionMapping',
})
export class RolesPermissionMapping {
  
    @Prop({
        ref: 'Role',
        type: SchemaTypes.ObjectId,
        required: true,
        index: true,
      })
      roleId: Role;

      @Prop({
        ref: 'Permission',
        type: SchemaTypes.ObjectId,
        required: true,
        index: true,
      })
      permissionId: Permission;

}

export const RolesPermissionMappingSchema = SchemaFactory.createForClass(RolesPermissionMapping);
