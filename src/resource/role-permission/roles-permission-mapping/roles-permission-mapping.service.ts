import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { FilterQuery, Model, QueryOptions } from "mongoose";
import { RolesPermissionMapping, RolesPermissionMappingSchema, rolesPermissionMappingDocument } from "./schema/roles.permission.mapping.schema";
import { rolesPermissionMappingRepository } from "./roles-permission-mapping.repository";
import { PaginatorSchema, PaginatorSchematicsInterface } from "src/utils/paginator/paginator.schema";
import { RolesPermissionMaapingCreateDto } from "./dto/role-permission-mapping-create-dto";
import { UpdateRolePermissionMappingDto } from "./dto/role-permission-mapping-update-dto";

@Injectable()
export class rolesPermissionMappingService {
    constructor(
        @InjectModel(RolesPermissionMapping.name)
        private rolePermissionMapping: Model<rolesPermissionMappingDocument>,
        private readonly genericRepository: rolesPermissionMappingRepository
    ) { }


    async findAllPaginated(
        permissionName,
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
                    from: 'Role',
                    localField: 'roleId',
                    foreignField: '_id',
                    as: 'RoleResult'
                }
            }),
            pipeline.push({ $unwind: '$RoleResult' }),
            pipeline.push({
                $lookup: {
                    from: 'Permission',
                    localField: 'permissionId',
                    foreignField: '_id',
                    as: 'PermissionResult'
                }
            }),
            pipeline.push({ $unwind: '$PermissionResult' }),
            pipeline.push({
                $project: {
                    roleId: '$roleId',
                    roleName: '$RoleResult.Roles',
                    permissionId: '$permissionId',
                    permissionName: '$PermissionResult.ModuleName'
                }
            })

        if (permissionName) {
            pipeline.push({ $match: { permissionName: { $regex: new RegExp(`.*${permissionName}.*`, 'i') } } });
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
        const aggregationResult = await this.rolePermissionMapping.aggregate(pipeline);
        const totalRecords = aggregationResult.length > 0 ? aggregationResult[0].totalRecords : 0;

        pipeline.pop(); // Remove $count stage for actual data fetch
        pipeline.push(
            { $skip: options.skip },
            { $limit: options.pageSize },
        );
        const data = await this.rolePermissionMapping.aggregate<RolesPermissionMapping>(pipeline);
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
        request: RolesPermissionMaapingCreateDto
    ): Promise<any> {
        try {
            for (const permissionId of request.permissionId) {
                const setQuery = {
                    permissionId: permissionId,
                    roleId: request.roleId
                };
                await this.genericRepository.create(setQuery as any);
            };
            return {
                successed: true,
                message: 'Permission Added successfully'
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
        request: UpdateRolePermissionMappingDto
    ): Promise<any> {
        try {
            for (const permissionId of request.permissionId) {
                const updatePayload = {
                    permissionId: permissionId,
                    roleId: request.roleId
                };
                await this.genericRepository.update(id,updatePayload);
            };               
            return {
                successed: true,
                message: 'Permission update successfully!'
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
                message: 'Permission delete successfully!'
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