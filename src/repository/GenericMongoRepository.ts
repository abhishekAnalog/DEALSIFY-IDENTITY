import { Injectable } from '@nestjs/common';
import { IGenericRepository } from './IGenericRepository';
import { Types, QueryOptions, FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Projection } from './types';
import {
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from '../utils/paginator/paginator.schema';

@Injectable()
export class GenericRepository<T> implements IGenericRepository<T> {
  protected constructor(protected readonly model: Model<T>) {}

  findById(id: Types.ObjectId, options?: QueryOptions<unknown>): Promise<T> {
    return this.model.findById(id, {}, options).exec();
  }

  async findAll(
    query?: FilterQuery<T>,
    options: QueryOptions = { sort: { _id: 'asc' } },
    projection?: Projection<T>,
  ): Promise<Array<T>> {
    return this.model.find(query, projection, options).exec();
  }

  async findAllPaginated(
    query?: FilterQuery<T>,
    options: QueryOptions = {
      skip: 0,
      limit: 10,
      lean: true,
      sort: {},
    },
    projection?: Projection<T>,
    sortField?: string,
    sortOrder?: 'ascend' | 'descend',
  ): Promise<PaginatorSchematicsInterface<T>> {
    const sortOptions = sortField
      ? { [sortField]: sortOrder === 'ascend' ? 1 : -1 }
      : {};

    const [total, data] = await Promise.all([
      this.model.countDocuments(query).exec(),
      this.model
        .find(query, projection, { ...options, sort: sortOptions })
        .exec(),
    ]);

    const page = options.skip / options.limit ?? 0;

    return PaginatorSchema.build<T>(
      total,
      data,
      page,
      options.limit ?? 10,
      true,
    );
  }

  first(): Promise<T> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T> {
    return this.model
      .findByIdAndUpdate(id, data, { new: true })
      .exec() as Promise<T>;
  }
  create<DTO = any>(data: DTO): Promise<T> {
    return this.model.create(data);
  }
  delete(id: Types.ObjectId): Promise<T> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
