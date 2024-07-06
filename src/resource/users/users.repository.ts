import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, usersDocument } from './schemas/users.schemas';
import { GenericRepository } from 'src/repository/GenericMongoRepository';
@Injectable()
export class usersRepository extends GenericRepository<usersDocument> {
  constructor(
    @InjectModel(Users.name)
    protected readonly model: Model<usersDocument>,
  ) {
    super(model);
  }
}
