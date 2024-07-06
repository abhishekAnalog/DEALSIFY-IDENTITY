import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { adminUsersService } from "./admin.users.service";
import { ValidationTransformPipe } from "src/common/pipes/validation.transform.pipe";
import PaginatorTransformPipe from "src/utils/paginator/paginator.transform.pipe";
import Paginator from "src/utils/paginator/paginator";
import { AdminUsersCreateDto } from "./dto/admin-users-create-dto";

 
@Controller({
  version: '1',
  path: 'admin-users',
})
export class adminUsersController {
  constructor(private adminUserService: adminUsersService) { }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  get(
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { pageSize, skip, sortOrder, sortField }: Paginator,
  ) {
    return this.adminUserService.findAll(pageSize, skip, sortField, sortOrder);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Req() req, @Param('id') id: string) {
    return this.adminUserService.findById(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Body() adminUsersCreateDto: AdminUsersCreateDto) {
    return this.adminUserService.create(adminUsersCreateDto);
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  update(@Param('id') id: string, @Body() request: AdminUsersCreateDto) {
    return this.adminUserService.update(id, request);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.adminUserService.delete(id);
  }

  @UseGuards(AuthGuard)
  @Put('user-status/:id')
  userStatus(@Req() req, @Param('id') id: string, @Query() query) {
    return this.adminUserService.userStatus(id, query.status);
  }
}
