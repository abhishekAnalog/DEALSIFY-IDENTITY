import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { ValidationTransformPipe } from "src/common/pipes/validation.transform.pipe";
import Paginator from "src/utils/paginator/paginator";
import PaginatorTransformPipe from "src/utils/paginator/paginator.transform.pipe";
import { userRolesMappingService } from "./user-roles-mapping.service";
import { UserRolesMaapingCreateDto } from "./dto/user-roles-mapping-create-dto";
import { UpdateUserRolesMappingDto } from "./dto/user-roles-mapping-update-dto";

@Controller({
    version: '1',
    path: 'user-roles-mapping',
})

export class userRolesMappingController {
    constructor(
        private userRolesMappingService: userRolesMappingService

    ) { }

    @HttpCode(HttpStatus.OK)
    @Get()
    get(@Query(ValidationTransformPipe, PaginatorTransformPipe)
    { pageNumber, pageSize, skip, sortOrder, sortField, columnSearchInput }: Paginator, @Query("userName") userName: string, @Query("roleName") roleName: string) {
        const option = {
            pageNumber: +pageNumber,
            pageSize: +pageSize,
            skip: +skip
        }
        return this.userRolesMappingService.findAllPaginated(
            userName,
            roleName,
            sortField,
            sortOrder,
            option
        );
    }

    @HttpCode(HttpStatus.OK)
    @Post()
    create(@Body() userRolesCreate: UserRolesMaapingCreateDto) {
        return this.userRolesMappingService.create(userRolesCreate);
    }

    @HttpCode(HttpStatus.OK)
    @Put(":id")
    update(@Param('id') id: string, @Body() request: UpdateUserRolesMappingDto) {
        return this.userRolesMappingService.update(id, request);
    }

    @HttpCode(HttpStatus.OK)
    @Delete(":id")
    delete(@Param('id') id: string) {
        return this.userRolesMappingService.delete(id);
    }

}
