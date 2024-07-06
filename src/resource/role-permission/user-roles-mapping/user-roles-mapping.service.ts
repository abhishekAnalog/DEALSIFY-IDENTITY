import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserRolesMapping, userRolesMappingDocument } from "./schemas/user.role.mapping.schema";
import { userRolesMappingRepository } from "./user-roles-mapping.respository";
import mongoose, { Model, QueryOptions } from "mongoose";
import { PaginatorSchema, PaginatorSchematicsInterface } from "src/utils/paginator/paginator.schema";
import { RolesPermissionMapping } from "../roles-permission-mapping/schema/roles.permission.mapping.schema";
import { UserRolesMaapingCreateDto } from "./dto/user-roles-mapping-create-dto";
import { UpdateUserRolesMappingDto } from "./dto/user-roles-mapping-update-dto";

@Injectable()
export class userRolesMappingService {
    constructor(
        @InjectModel(UserRolesMapping.name)
        private userRolesMapping: Model<userRolesMappingDocument>,
        private readonly genericRepository: userRolesMappingRepository
    ) { }


    async findAllPaginated(
        userName,
        roleName,
        sortField?: string,
        sortOrder?: string,
        options: QueryOptions = { skip: 0, limit: 10, lean: true }
    ): Promise<PaginatorSchematicsInterface<RolesPermissionMapping>> {
        const pipeline: any[] = [
        ];
        pipeline.push(
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userResult'
                }
            }),
            pipeline.push({ $unwind: '$userResult' }),
            pipeline.push({
                $lookup: {
                    from: 'Role',
                    localField: 'roleId',
                    foreignField: '_id',
                    as: 'RoleResult'
                }
            }),
            pipeline.push({ $unwind: '$RoleResult' }),
            pipeline.push({
                $project: {
                    roleId: '$roleId',
                    roleName: '$RoleResult.Roles',
                    userId: '$userId',
                    userName: '$userResult.name'
                }
            })

        if (userName) {
            pipeline.push({ $match: { userName: { $regex: new RegExp(`.*${userName}.*`, 'i') } } });
        }
        if (roleName) {
            pipeline.push({ $match: { roleName: { $regex: new RegExp(`.*${roleName}.*`, 'i') } } });
        }
        const orderByQuery = {};

        if (sortField && sortOrder) {
            orderByQuery[sortField] = sortOrder === 'ascend' ? 1 : -1;
        } else {
            orderByQuery['_id'] = -1;

        }
        pipeline.push({ $sort: orderByQuery })
        pipeline.push({ $count: 'totalRecords' });
        const aggregationResult = await this.userRolesMapping.aggregate(pipeline);
        const totalRecords = aggregationResult.length > 0 ? aggregationResult[0].totalRecords : 0;

        pipeline.pop(); // Remove $count stage for actual data fetch
        pipeline.push(
            { $skip: options.skip },
            { $limit: options.pageSize },
        );
        const data = await this.userRolesMapping.aggregate<RolesPermissionMapping>(pipeline);
        const page = options.skip / options.limit ?? 0;

        return PaginatorSchema.build<RolesPermissionMapping>(
            totalRecords,
            data,
            page,
            options.limit ?? 10,
            true
        );
    }

    async create(
        request: UserRolesMaapingCreateDto
    ): Promise<any> {
        try {
            for (const permissionId of request.roleId) {
                const setQuery = {
                    permissionId: permissionId,
                    roleId: request.roleId
                };
                await this.genericRepository.create(setQuery as any);
            };
            return {
                successed: true,
                message: 'Users-Roles Added successfully'
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
        request: UpdateUserRolesMappingDto
    ): Promise<any> {
        try {
            for (const permissionId of request.roleId) {
                const updatePayload = {
                    permissionId: permissionId,
                    roleId: request.roleId
                };
                await this.genericRepository.update(id, updatePayload);
            };
            return {
                successed: true,
                message: 'Users-Roles update successfully!'
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
                message: 'Users-Roles delete successfully!'
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