import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AdminUsers } from './schemas/admin.users.schema';
import { adminUsersRepository } from './admin.users.repository';
import mongoose, { FilterQuery } from 'mongoose';
import { AdminUsersCreateDto } from './dto/admin-users-create-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class adminUsersService {
  constructor(private readonly genericRepository: adminUsersRepository) {}

  async findAll(
    perPage: number,
    skip: number,
    sortField: string,
    sortOrder: 'ascend' | 'descend',
  ): Promise<any> {
    try {
      const options = {
        skip: skip,
        limit: perPage,
        lean: true,
      };
      const query: FilterQuery<AdminUsers> = {};
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
  public async findById(id: string) {
    try {
      const getOneRecord = await this.genericRepository.findById(
        new mongoose.Types.ObjectId(id),
      );
      if (getOneRecord) {
        return getOneRecord;
      } else {
        throw new HttpException(
          {
            status: 'fail',
            message: 'No Record Found!!!',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
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

  async create(adminUsersCreateDto: AdminUsersCreateDto): Promise<any> {
    try {
      const saltRounds = 2;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(adminUsersCreateDto.password, salt);

      const setQuery = {
        email: adminUsersCreateDto.email.trim(),
        password: hash,
        isActive: true,
        phoneNumber: adminUsersCreateDto.phoneNumber,
        userName: adminUsersCreateDto.userName.trim(),
      };
      await this.genericRepository.create(setQuery as any);
      return {
        successed: true,
        message: 'User created successfully!',
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException(
          {
            successed: false,
            message:
              'User creation failed: A user with this email already exists. Please choose a unique email address.',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        // Handle other types of errors
        throw new HttpException(
          {
            message: 'Internal server error!!!',
            stack: error.stack,
            name: error.name,
            successed: false,
            err: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async update(id: string, updateUserDto: AdminUsersCreateDto): Promise<any> {
    try {
      const setQuery = {
        email: updateUserDto?.email?.trim(),
        phoneNumber: updateUserDto.phoneNumber,
        userName: updateUserDto?.userName?.trim(),
        image: updateUserDto?.image,
      };
      const updatedData = await this.genericRepository.update(id, setQuery);
      return {
        data: updatedData,
        message: 'User Updated Successfully!',
        status: 'success',
        succeeded: true,
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
            succeeded: false,
            err: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  public async delete(id: string) {
    try {
      const deleteRecord = await this.genericRepository.delete(
        new mongoose.Types.ObjectId(id),
      );
      if (deleteRecord) {
        return {
          status: 'success',
          message: 'User delete successfully',
          successed: true,
        };
      } else {
        throw new HttpException(
          {
            status: 'fail',
            message: 'No Record Found!!!',
            successed: false,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
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

  async userStatus(id: string, status: boolean): Promise<any> {
    try {
      const setQuery = {
        isActive: status,
      };
      const updatedData = await this.genericRepository.update(id, setQuery);
      return {
        data: updatedData,
        message: 'User status update successfully',
        status: 'success',
        succeeded: true,
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
            succeeded: false,
            err: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
