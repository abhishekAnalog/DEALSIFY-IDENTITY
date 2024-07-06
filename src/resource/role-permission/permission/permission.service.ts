import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery } from 'mongoose';
import { Permission } from './schemas/permission.schema';
import { permissionRepository } from './permission.repository';
import { CreateModulesDto } from '../erp-modules/dto/create-modules.dto';

@Injectable()
export class permissionService {
  constructor(private readonly genericRepository: permissionRepository) {}

  async findAll(
    page: number,
    perPage: number,
    skip: number,
    sortField: string,
    sortOrder: 'ascend' | 'descend',
    permissionName: string,
  ): Promise<any> {
    try {
      const options = {
        skip: skip,
        limit: perPage,
        lean: true,
      };
      let query: FilterQuery<Permission> = {};
      if (permissionName) {
        query = {
          ModuleName: new RegExp(permissionName, 'i'), // Adjust field name based on your schema
        };
      }
      const getAllRecords = await this.genericRepository.findAllPaginated(
        query,
        options,
        undefined,
        sortField,
        sortOrder,
      );
      return getAllRecords;
    } catch (error) {
      // Custom error handling logic
      if (error instanceof HttpException) {
        // Handle HttpException here or re-throw it
        throw error;
      } else {
        // You can throw your custom error here if needed
        throw new HttpException(
          {
            message: 'Internal server error!!!',
            stack: error.stack,
            name: error.name,
            status: 'fail',
            err: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async update(id: string, request: CreateModulesDto): Promise<any> {
    try {
      const updatePayload = {
        ModuleName: request.moduleName.join().toUpperCase(),
      };
      const update = await this.genericRepository.update(id, updatePayload);
      return {
        successed: true,
        message: 'Permission update successfully!',
      };
    } catch (error) {
      // Custom error handling logic
      if (error instanceof HttpException) {
        // Handle HttpException here or re-throw it
        throw error;
      } else {
        // You can throw your custom error here if needed
        throw new HttpException(
          {
            message: 'Internal server error!!!',
            stack: error.stack,
            name: error.name,
            status: 'fail',
            err: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async delete(id: string): Promise<any> {
    try {
      await this.genericRepository.delete(new mongoose.Types.ObjectId(id));
      return {
        successed: true,
        message: 'Permission delete successfully!',
      };
    } catch (error) {
      // Custom error handling logic
      if (error instanceof HttpException) {
        // Handle HttpException here or re-throw it
        throw error;
      } else {
        // You can throw your custom error here if needed
        throw new HttpException(
          {
            message: 'Internal server error!!!',
            stack: error.stack,
            name: error.name,
            status: 'fail',
            err: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
