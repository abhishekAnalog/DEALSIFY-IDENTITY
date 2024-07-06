import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { permissionService } from "./permission.service";
import { CreateModulesDto } from "../erp-modules/dto/create-modules.dto";
import { erpModulesService } from "../erp-modules/erp-modules.service";
import { ValidationTransformPipe } from "src/common/pipes/validation.transform.pipe";
import PaginatorTransformPipe from "src/utils/paginator/paginator.transform.pipe";
import Paginator from "src/utils/paginator/paginator";
import { UsersService } from "src/resource/users/users.service";
import { AuthGuard } from "src/guards/auth.guard";
@Controller({
    version: '1',
    path: 'permission',
})

export class permissionController {
    constructor(
        private permissionService: permissionService,
        private erpModulesService: erpModulesService,
        private usersService: UsersService
    ) { }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get()
    get(@Query(ValidationTransformPipe, PaginatorTransformPipe)
    { pageNumber, pageSize, skip, sortOrder, sortField, columnSearchInput }: Paginator, @Query("permissionName") permissionName: string) {
        return this.permissionService.findAll(
            pageNumber,
            pageSize,
            skip,
            sortField,
            sortOrder,
            permissionName
        );
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post()
    create(@Body() createModulesDto: CreateModulesDto) {
        return this.erpModulesService.create(createModulesDto);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get("mapping")
    permissionMapping(@Req() req, @Query('id') id: string) {
        let userId = req?.user?.id ?? id
        return this.usersService.getUserPermision(userId);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Put(":id")
    update(@Param('id') id: string, @Body() createModulesDto: CreateModulesDto) {
        return this.erpModulesService.update(id, createModulesDto);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Delete(":id")
    delete(@Param('id') id: string) {
        return this.permissionService.delete(id);
    }
}