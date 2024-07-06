import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Modules, modulesDocument } from './schemas/erp-modules.schemas';
import mongoose, { Model } from 'mongoose';
import { erpModulesRepository } from './erp-modules.repository';
import { CreateModulesDto } from './dto/create-modules.dto';

@Injectable()
export class erpModulesService {
  constructor(
    @InjectModel(Modules.name)
    private modulesModel: Model<modulesDocument>,
    private readonly genericRepository: erpModulesRepository,
  ) {}

  async findAll(): Promise<any> {
    try {
      const getAllRecords = await this.genericRepository.findAll();
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

  async findById(id: string): Promise<any> {
    try {
      const getByIdRecords = await this.genericRepository.findById(
        new mongoose.Types.ObjectId(id),
      );
      return getByIdRecords;
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

  async create(request: CreateModulesDto): Promise<any> {
    try {
      for (const moduleName of request.moduleName) {
        const formattedModuleName = request.isSpecific
          ? this.formatModuleName(moduleName)
          : moduleName.toUpperCase();

        if (request.isSpecific) {
          const permissionArray = [
            'READ',
            'ADD',
            'UPDATE',
            'DELETE',
            'READ_OWN',
            'READ_ANY',
            'ADD_OWN',
            'ADD_ANY',
            'UPDATE_OWN',
            'UPDATE_ANY',
            'DELETE_OWN',
            'DELETE_ANY',
          ];
          const permissions = permissionArray.map((permissionName) => ({
            ModuleName: `${formattedModuleName}_${permissionName}`,
          }));
          await this.modulesModel.insertMany(permissions);
        } else {
          const permission = new this.modulesModel({
            ModuleName: formattedModuleName,
          });
          await permission.save();
        }
      }
      return {
        successed: true,
        message: 'Modules created successfully!',
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

  async update(id: string, request: CreateModulesDto): Promise<any> {
    try {
      const updatePayload = {
        ModuleName: request.moduleName.join().toUpperCase(),
      };
      const update = await this.genericRepository.update(id, updatePayload);
      return {
        successed: true,
        message: 'Modules update successfully!',
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
        message: 'Modules delete successfully!',
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

  formatModuleName(moduleName: string): string {
    return moduleName.toUpperCase();
  }
}
