import {
  Body,
  Controller,
  Req,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Query,
  Post,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../guards/auth.guard';
import { CreateUserDto } from './dto/create-users-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { ResetPasswordDto } from './dto/reset-password-dto';
import { ValidationTransformPipe } from 'src/common/pipes/validation.transform.pipe';
import PaginatorTransformPipe from 'src/utils/paginator/paginator.transform.pipe';
import Paginator from 'src/utils/paginator/paginator';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ChangePasswordDto } from './dto/change-password-dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ResetPasswordRequestDto } from './dto/reset-password-request-dto';

@Controller({
  version: '1',
  path: 'users',
})
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  getUsers(
    @Req() req,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    {
      pageNumber,
      pageSize,
      skip,
      sortOrder,
      sortField,
      columnSearchInput,
    }: Paginator,
    userName: string,
  ) {
    const companyId = req?.user?.companyId;
    const option = {
      pageNumber: +pageNumber,
      pageSize: +pageSize,
      skip: +skip,
    };
    return this.usersService.findAllPaginated(
      companyId,
      columnSearchInput,
      userName,
      sortField,
      sortOrder,
      option,
    );
  }

  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully!' })
  @UseGuards(AuthGuard)
  @Post('')
  create(@Req() req, @Body() createUserDto: CreateUserDto) {
    const companyId = req.user.companyId;
    return this.usersService.create(createUserDto, companyId);
  }

  @ApiBody({ type: UpdateUserDto })
  @UseGuards(AuthGuard)
  @Put('user-update/:id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const companyId = req.user.companyId;
    return this.usersService.update(id, updateUserDto, companyId);
  }

  // @UseGuards(AuthGuard)
  // @Get(':id')
  // findById(@Req() req, @Param('id') id: string) {
  //   return this.usersService.findById(id);
  // }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @UseGuards(AuthGuard)
  @Put('user-status-update/:id')
  userStatus(@Req() req, @Param('id') id: string, @Query() query) {
    return this.usersService.userStatus(id, query.status);
  }

  @UseGuards(AuthGuard)
  @Put('company-status-update/:id')
  companyStatus(@Req() req, @Param('id') id: string, @Query() query) {
    return this.usersService.companyStatus(id, query.status);
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  changePassword(@Req() req, @Body() ChangePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(ChangePasswordDto);
  }

  // @UseGuards(AuthGuard)
  @Post('reset-password')
  resetPassword(@Req() req, @Body() resetPasswordDto: ResetPasswordDto) {
    const origin = req.headers['origin'];
    return this.usersService.resetPassword(resetPasswordDto, origin);
  }
  @UseGuards(AuthGuard)
  @Get('validate-token')
  validateToken(@Req() req, @Query() query) {
    const userId = req?.user?.id;
    return this.usersService.validateToken(query.token, userId);
  }
  // @UseGuards(AuthGuard)
  @Post('checked-token')
  checkedToken(@Req() req, @Query() query) {
    return this.usersService.checkedToken(query.token);
  }

  // @UseGuards(AuthGuard)
  @Post('update-password')
  resetToken(@Body() ResetPasswordRequestDto: ResetPasswordRequestDto) {
    return this.usersService.updatePassword(ResetPasswordRequestDto);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Query() query) {
    return this.usersService.logout(query.token);
  }
}
