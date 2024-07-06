import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { roleService } from "./roles.service";
import { RolesCreateDto } from "./dto/roles-create-dto";
import { ValidationTransformPipe } from "src/common/pipes/validation.transform.pipe";
import PaginatorTransformPipe from "src/utils/paginator/paginator.transform.pipe";
import Paginator from "src/utils/paginator/paginator";

@Controller({
    version: '1',
    path: 'role',
})

export class roleController {
    constructor(
        private roleService: roleService
    ) { }
    @HttpCode(HttpStatus.OK)
    @Get()
    get(@Query(ValidationTransformPipe, PaginatorTransformPipe)
    { pageNumber, pageSize, skip, sortOrder, sortField, columnSearchInput }: Paginator, @Query("roleName") roleName: string) {
        return this.roleService.findAll(
            pageNumber,
            pageSize,
            skip,
            sortField,
            sortOrder,
            roleName
        );
    }


    update(@Param('id') id: string, @Body() request: RolesCreateDto) {
        return this.roleService.update(id, request);
    }

    @HttpCode(HttpStatus.OK)
    @Delete(":id")
    delete(@Param('id') id: string) {
        return this.roleService.delete(id);
    }
}
