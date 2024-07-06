import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission, permissionDocument } from './schemas/permission.schema';
import { GenericRepository } from 'src/repository/GenericMongoRepository';

@Injectable()
export class permissionRepository extends GenericRepository<permissionDocument> {
    constructor(
        @InjectModel(Permission.name)
        protected readonly model: Model<permissionDocument>,
    ) {
        super(model);
    }

}