import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { usersTokenDocument } from './schemas/usertoken.schema';
import { GenericRepository } from 'src/repository/GenericMongoRepository';

@Injectable()
export class authRepository extends GenericRepository<usersTokenDocument> {
  constructor(
    @InjectModel("UserTokens")
    protected readonly model: Model<usersTokenDocument>,
  ) {
    super(model);
  }
}
