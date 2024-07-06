import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Role, rolesDocument } from "./schemas/roles.schema";
import mongoose, { FilterQuery, Model } from "mongoose";
import { roleRepository } from "./roles.respository";
import { RolesCreateDto } from "./dto/roles-create-dto";

@Injectable()
export class roleService {
    constructor(
        @InjectModel(Role.name)
        private roleModel: Model<rolesDocument>,
        private readonly genericRepository: roleRepository
    ) { }

    async findAll(
        page: number,
        perPage: number,
        skip: number,
        sortField: string,
        sortOrder: 'ascend' | 'descend',
        roleName: string
    ): Promise<any> {
        try {
            const options = {
                skip: skip,
                limit: perPage,
                lean: true,
            };
            let query: FilterQuery<Role> = {};
            if (roleName) {
                query = {
                    Roles: new RegExp(roleName, 'i') // Adjust field name based on your schema
                };
            }
            const getAllRecords = await this.genericRepository.findAllPaginated(
                query,
                options,
                undefined,
                sortField,
                sortOrder
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

    async create(
        request: RolesCreateDto
    ): Promise<any> {
        try {
            const setQuery = {                
                Roles: request.roles
              };
              await this.genericRepository.create(setQuery as any);
            return {
                successed: true,
                message: 'Roles created successfully!'
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

    async update(
        id: string,
        request: RolesCreateDto
    ): Promise<any> {
        try {
            const updatePayload = {
                Roles: request.roles
            }
            const update = await this.genericRepository.update(id, updatePayload)
            return {
                successed: true,
                message: 'Roles update successfully!'
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

    async delete(
        id: string
    ): Promise<any> {
        try {
            await this.genericRepository.delete(new mongoose.Types.ObjectId(id));
            return {
                successed: true,
                message: 'Roles delete successfully!'
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