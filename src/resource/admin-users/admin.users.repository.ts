import { Injectable } from '@nestjs/common';
import { GenericRepository } from 'src/repository/GenericMongoRepository';
import { AdminUsers, adminUsersDocument } from './schemas/admin.users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class adminUsersRepository extends GenericRepository<adminUsersDocument> {
  constructor(
    @InjectModel(AdminUsers.name)
    protected readonly model: Model<adminUsersDocument>,
  ) {
    super(model);
  }
}
