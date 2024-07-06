import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { rolesPermissionMappingService } from "./roles-permission-mapping.service";
import { ValidationTransformPipe } from "src/common/pipes/validation.transform.pipe";
import PaginatorTransformPipe from "src/utils/paginator/paginator.transform.pipe";
import Paginator from "src/utils/paginator/paginator";
import { RolesPermissionMaapingCreateDto } from "./dto/role-permission-mapping-create-dto";
import { UpdateRolePermissionMappingDto } from "./dto/role-permission-mapping-update-dto";

@Controller({
    version: '1',
    path: 'role-permission-mapping',
})

export class rolesPermissionMappingController {
    constructor(
        private rolesPermissionMappingService: rolesPermissionMappingService

    ) { }

    @HttpCode(HttpStatus.OK)
    @Get()
    get(@Query(ValidationTransformPipe, PaginatorTransformPipe)
    { pageNumber, pageSize, skip, sortOrder, sortField, columnSearchInput }: Paginator, @Query("permissionName") permissionName: string, @Query("roleName") roleName: string) {
        const option = {
            pageNumber: +pageNumber,
            pageSize: +pageSize,
            skip: +skip
        }
        return this.rolesPermissionMappingService.findAllPaginated(
            permissionName,
            roleName,
            sortField,
            sortOrder,
            option
        );
    }

    @HttpCode(HttpStatus.OK)
    @Post()
    create(@Body() rolePermissionMappingDto: RolesPermissionMaapingCreateDto) {
        return this.rolesPermissionMappingService.create(rolePermissionMappingDto);
    }

    @HttpCode(HttpStatus.OK)
    @Put(":id")
    update(@Param('id') id: string, @Body() request: UpdateRolePermissionMappingDto) {
        return this.rolesPermissionMappingService.update(id, request);
    }

    @HttpCode(HttpStatus.OK)
    @Delete(":id")
    delete(@Param('id') id: string) {
        return this.rolesPermissionMappingService.delete(id);
    }

}
