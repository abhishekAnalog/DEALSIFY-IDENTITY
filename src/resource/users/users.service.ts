import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, usersDocument } from './schemas/users.schemas';
import mongoose, { Model, QueryOptions } from 'mongoose';
import { usersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-users-dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user-dto';
import {
  Company,
  companyDocument,
} from '../company/schemas/onboard/company.schemas';
import { ChangePasswordDto } from './dto/change-password-dto';
import { ResetPasswordDto } from './dto/reset-password-dto';
import { UserTokens } from './auth/schemas/usertoken.schema';
import axios from 'axios';
import { ResetPasswordRequestDto } from './dto/reset-password-request-dto';
import { AllowSpecialCharacterHelpers } from 'src/common/pipes/allow-special-character-helpers';
import { JsonBuilderHelpers } from 'src/common/pipes/json-builder-helpers';
import { generateRandomToken } from 'src/utils/common/generate.random.token';
import {
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from 'src/utils/paginator/paginator.schema';
import { UserPermissionResponse } from './dto/user-permission-response-dto';
import { DateHelpers } from 'src/common/types/date.helper';
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private usersModel: Model<usersDocument>,
    @InjectModel(Company.name)
    private companyModel: Model<companyDocument>,
    @InjectModel('UserTokens')
    private usersTokenModel: Model<UserTokens>,
    private allowSpecialCharacterHelpers: AllowSpecialCharacterHelpers,
    private jsonBuilderHelpers: JsonBuilderHelpers,
    private readonly genericRepository: usersRepository,
    private dateHelpers: DateHelpers,
  ) {}

  public async findOne(email: string) {
    try {
      const getOneRecord = await this.usersModel
        .findOne({ email: email })
        .exec();
      if (getOneRecord) {
        return { data: getOneRecord, status: 'success' };
      }
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

  async findAllPaginated(
    companyId: string,
    columnSearchInput?: string,
    userName?: string,
    sortField?: string,
    sortOrder?: string,
    options: QueryOptions = { skip: 0, limit: 10, lean: true },
  ): Promise<PaginatorSchematicsInterface<Users>> {
    const filteredQuery = {
      company_id: new mongoose.Types.ObjectId(companyId),
    };
    if (columnSearchInput) {
      const escapedSearch =
        this.allowSpecialCharacterHelpers.replacingString(columnSearchInput);
      filteredQuery['$or'] = [
        await this.jsonBuilderHelpers.generateEscapedTextSearchingAndAddRegex(
          'email',
          escapedSearch,
        ),
        await this.jsonBuilderHelpers.generateEscapedTextSearchingAndAddRegex(
          'name',
          escapedSearch,
        ),
      ];
    }
    const pipeline: any[] = [{ $match: filteredQuery }];

    pipeline.push({
      $project: {
        companyId: '$company_id',
        email: '$email',
        financialYearId: '$financialYearId',
        phoneNumber: '$phoneNumber',
        RoleId: '$RoleId',
        userName: '$name',
        isActive: '$isActive',
        id: '$_id',
      },
    });

    if (userName) {
      pipeline.push({
        $match: { userName: { $regex: new RegExp(`.*${userName}.*`, 'i') } },
      });
    }

    const orderByQuery = {};

    if (sortField && sortOrder) {
      orderByQuery[sortField] = sortOrder === 'ascend' ? 1 : -1;
    } else {
      orderByQuery['_id'] = -1;
    }
    pipeline.push({ $sort: orderByQuery });
    pipeline.push({ $count: 'totalRecords' });
    const aggregationResult = await this.usersModel.aggregate(pipeline);
    const totalRecords =
      aggregationResult.length > 0 ? aggregationResult[0].totalRecords : 0;

    pipeline.pop(); // Remove $count stage for actual data fetch
    pipeline.push({ $skip: options.skip }, { $limit: options.pageSize });
    const data = await this.usersModel.aggregate<Users>(pipeline);

    const page = options.skip / options.limit ?? 0;

    return PaginatorSchema.build<Users>(
      totalRecords,
      data,
      page,
      options.limit ?? 10,
      true,
    );
  }
  async getUserPermision(id: string): Promise<any> {
    try {
      const pipeline = [];

      // Match stage
      pipeline.push({
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      });

      // First lookup stage
      pipeline.push({
        $lookup: {
          from: 'UserRolesMapping',
          localField: '_id',
          foreignField: 'userId',
          as: 'Roles',
        },
      });

      // Unwind Roles stage
      pipeline.push({
        $unwind: { path: '$Roles', preserveNullAndEmptyArrays: true },
      });

      // Second lookup stage
      pipeline.push({
        $lookup: {
          from: 'Role',
          localField: 'Roles.roleId',
          foreignField: '_id',
          as: 'RoleName',
        },
      });

      // Unwind RoleName stage
      pipeline.push({
        $unwind: { path: '$RoleName', preserveNullAndEmptyArrays: true },
      });

      // Third lookup stage
      pipeline.push({
        $lookup: {
          from: 'RolesPermissionMapping',
          localField: 'RoleName._id',
          foreignField: 'roleId',
          as: 'Permission',
        },
      });

      // Project stage
      pipeline.push({
        $project: {
          name: '$name',
          RoleName: '$RoleName.Roles',
          Permission: '$Permission',
          RoleId: '$RoleName._id',
          CompanyId: '$company_id',
        },
      });
      // Unwind Permission stage
      pipeline.push({
        $unwind: { path: '$Permission', preserveNullAndEmptyArrays: true },
      });

      // Fourth lookup stage
      pipeline.push({
        $lookup: {
          from: 'Permission',
          localField: 'Permission.permissionId',
          foreignField: '_id',
          as: 'PermissionDetails',
        },
      });

      // Unwind PermissionDetails stage
      pipeline.push({
        $unwind: {
          path: '$PermissionDetails',
          preserveNullAndEmptyArrays: true,
        },
      });
      pipeline.push({
        $project: {
          name: '$name',
          RoleName: '$RoleName',
          Permission: '$Permission',
          RoleId: '$RoleId',
          CompanyId: '$CompanyId',
          PermissionDetails: {
            _id: '$PermissionDetails._id',
            moduleName: '$PermissionDetails.ModuleName',
          },
        },
      });
      // Group stage
      pipeline.push({
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          roleName: { $first: '$RoleName' },
          companyId: { $first: '$CompanyId' },
          permissions: { $push: '$PermissionDetails' },
        },
      });

      // Execute the pipeline
      const data =
        await this.usersModel.aggregate<UserPermissionResponse>(pipeline);
      return data[0];
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
  // async findAll(
  //   page: number,
  //   perPage: number,
  //   skip: number,
  //   companyId: string,
  // ): Promise<any> {
  //   try {
  //     const options = {
  //       skip: skip,
  //       limit: perPage,
  //       lean: true,
  //     };
  //     const getAllRecords = await this.genericRepository.findAllPaginated(
  //       undefined,
  //       options,
  //     );
  //     return getAllRecords;
  //   } catch (error) {
  //     // Custom error handling logic
  //     if (error instanceof HttpException) {
  //       // Handle HttpException here or re-throw it
  //       throw error;
  //     } else {
  //       // You can throw your custom error here if needed
  //       throw new HttpException(
  //         {
  //           message: 'Internal server error!!!',
  //           stack: error.stack,
  //           name: error.name,
  //           status: 'fail',
  //           err: error.message,
  //         },
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }
  //   }
  // }

  async create(createUserDto: CreateUserDto, companyId: string): Promise<any> {
    try {
      const saltRounds = 2;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(createUserDto.password, salt);

      const setQuery = {
        email: createUserDto.email.trim(),
        password: hash,
        isActive: true,
        phoneNumber: createUserDto.phoneNumber,
        company_id: new mongoose.Types.ObjectId(companyId),
        reset_password_token: createUserDto.reset_password_token,
        reset_password_expires: createUserDto.reset_password_expires,
        name: createUserDto.userName.trim(),
        refresh_token: 'test',
      };
      await this.genericRepository.create(setQuery as any);
      return {
        successed: true,
        message: 'User created successfully!',
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException(
          {
            successed: false,
            message:
              'User creation failed: A user with this email already exists. Please choose a unique email address.',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        // Handle other types of errors
        throw new HttpException(
          {
            message: 'Internal server error!!!',
            stack: error.stack,
            name: error.name,
            successed: false,
            err: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    companyId: string,
  ): Promise<any> {
    try {
      const setQuery = {
        email: updateUserDto?.email?.trim(),
        phoneNumber: updateUserDto.phoneNumber,
        company_id: new mongoose.Types.ObjectId(companyId),
        reset_password_token: updateUserDto.reset_password_token,
        reset_password_expires: updateUserDto.reset_password_expires,
        name: updateUserDto?.userName?.trim(),
        refresh_token: 'test',
      };
      const updatedData = await this.genericRepository.update(id, setQuery);
      return {
        data: updatedData,
        message: 'User Updated Successfully!',
        status: 'success',
        succeeded: true,
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
            succeeded: false,
            err: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  async userStatus(id: string, status: boolean): Promise<any> {
    try {
      const setQuery = {
        isActive: status,
      };
      const updatedData = await this.genericRepository.update(id, setQuery);
      return {
        data: updatedData,
        message: 'User status update successfully',
        status: 'success',
        succeeded: true,
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
            succeeded: false,
            err: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  public async findById(id: string) {
    try {
      const getOneRecord = await this.genericRepository.findById(
        new mongoose.Types.ObjectId(id),
      );
      if (getOneRecord) {
        return getOneRecord;
      } else {
        throw new HttpException(
          {
            status: 'fail',
            message: 'No Record Found!!!',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
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
  public async delete(id: string) {
    try {
      const deleteRecord = await this.genericRepository.delete(
        new mongoose.Types.ObjectId(id),
      );
      if (deleteRecord) {
        return {
          status: 'success',
          message: 'User delete successfully',
          successed: true,
        };
      } else {
        throw new HttpException(
          {
            status: 'fail',
            message: 'No Record Found!!!',
            successed: false,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
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

  async companyStatus(id: string, status: boolean): Promise<any> {
    try {
      const setQuery = {
        isActive: status,
      };
      const updatedData = await this.companyModel.updateOne(setQuery);
      return {
        data: updatedData,
        message: 'Company status update successfully',
        status: 'success',
        succeeded: true,
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
            succeeded: false,
            err: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  async changePassword(changePasswordDto: ChangePasswordDto): Promise<any> {
    try {
      const userReocrd = await this.genericRepository.findById(
        new mongoose.Types.ObjectId(changePasswordDto.userId),
      );
      const myhashcompate = bcrypt.compareSync(
        changePasswordDto.currentPassword,
        userReocrd.password,
      );
      if (myhashcompate) {
        const saltRounds = 2;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(changePasswordDto.newPassword, salt);
        const updatedData = await this.usersModel
          .findByIdAndUpdate(
            changePasswordDto.userId,
            { password: hash },
            {
              new: true,
            },
          )
          .exec();
        await this.usersTokenModel
          .deleteMany({ userId: changePasswordDto.userId })
          .exec();
        return {
          data: updatedData,
          message: 'Password Change Successfully!',
          status: 'success',
          successed: true,
        };
      } else {
        return {
          status: 'fail',
          message: 'Please check your current password and try again!',
          successed: false,
        };
      }
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
            successed: false,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    origin: string,
  ): Promise<any> {
    try {
      const userRecord = await this.getUserByEmail(resetPasswordDto.email);

      if (!userRecord) {
        return this.createFailureResponse('User not found');
      }

      const today = this.getTodayDate();
      const restrictionCheckResult = this.checkEmailRestriction(
        userRecord,
        today,
      );

      if (restrictionCheckResult.exceeded) {
        return this.createFailureResponse(
          'Password reset limit exceeded. Try again tomorrow.',
        );
      }

      const tokenPayload = await this.createTokenPayload(
        userRecord,
        origin,
        restrictionCheckResult.isSameDay,
        today,
      );
      return {
        data: tokenPayload,
        successed: true,
        status: 'success',
        message: 'Email sent successfully',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async getUserByEmail(email: string) {
    return this.usersModel.findOne({ email }).exec();
  }

  private getTodayDate(): Date {
    const today = new Date();
    const dateString = this.dateHelpers.dateFormat(today);
    return new Date(dateString);
  }

  private checkEmailRestriction(userRecord: any, todayDate: Date) {
    const isSameDay =
      userRecord.emailRestrictionDate?.toString() === todayDate.toString();
    const exceeded = isSameDay && userRecord.emailRestrictionCount >= 5;
    return { isSameDay, exceeded };
  }

  private async createTokenPayload(
    userRecord: any,
    origin: string,
    isSameDay: boolean,
    todayDate: Date,
  ) {
    const token = generateRandomToken();
    const resetTokenExpires = this.getTokenExpirationTime();
    const payload = { resetToken: token, resetTokenExpires };

    await this.updateUserToken(userRecord._id, payload);
    await this.sendResetEmail(userRecord, token, origin);

    const emailRestrictionCount = isSameDay
      ? userRecord.emailRestrictionCount + 1
      : 0;
    await this.updateEmailRestriction(
      userRecord._id,
      todayDate,
      emailRestrictionCount,
    );

    return payload;
  }

  private getTokenExpirationTime(): number {
    return moment().add(10, 'minutes').valueOf();
  }

  private async updateUserToken(userId: string, payload: any) {
    await this.usersTokenModel.deleteMany({ userId }).exec();
    await this.genericRepository.update(userId.toString(), payload);
  }

  private async sendResetEmail(userRecord: any, token: string, origin: string) {
    const companyDetails = await this.companyModel
      .findOne({ _id: userRecord.company_id })
      .exec();

    const validationUrl = `${process.env.SMTP_BASE_URL}/email-notify/forgot-password`;
    const payload = {
      companyName: companyDetails.companyName,
      resetToken: token,
      origin: origin,
      userName: userRecord.name,
      email: userRecord.email,
    };
    await axios.post(validationUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private async updateEmailRestriction(
    userId: string,
    todayDate: Date,
    emailRestrictionCount: number,
  ) {
    const setQuery = {
      emailRestrictionDate: todayDate,
      emailRestrictionCount: emailRestrictionCount,
    };
    await this.genericRepository.update(userId.toString(), setQuery);
  }

  private createFailureResponse(message: string) {
    return {
      successed: false,
      status: 'fail',
      message,
    };
  }

  private handleError(error: any) {
    if (error instanceof HttpException) {
      throw error;
    } else {
      throw new HttpException(
        {
          message: 'Internal server error!!!',
          stack: error.stack,
          name: error.name,
          status: 'fail',
          err: error.message,
          successed: false,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateToken(token: string, id: string): Promise<any> {
    try {
      const getOneRecord = await this.getUserPermision(id);
      if (getOneRecord) {
        const response = {
          data: {
            ...getOneRecord,
          },
          succeeded: true,
          statusCode: 200,
          message: 'Token is validated',
          status: 'success',
        };
        return response;
      }
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
            successed: false,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async checkedToken(token: string): Promise<any> {
    try {
      const currentTime = moment().valueOf();
      const user = await this.usersModel
        .findOne({
          resetToken: token,
          resetTokenExpires: { $gt: currentTime },
        })
        .exec();
      if (user) {
        return {
          successed: true,
          status: 'success',
          message: 'Token is validate',
        };
      } else {
        throw new HttpException(
          {
            message: 'Password ResetExpired',
            successed: false,
            status: 'fail',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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
            successed: false,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updatePassword(
    ResetPasswordRequestDto: ResetPasswordRequestDto,
  ): Promise<any> {
    try {
      const currentTime = moment().valueOf();
      const user = await this.usersModel
        .findOne({
          resetToken: ResetPasswordRequestDto.token,
          resetTokenExpires: { $gt: currentTime },
        })
        .exec();

      if (user) {
        const bytes = CryptoJS.AES.decrypt(
          ResetPasswordRequestDto.password,
          process.env.PASSWORD_SECRET_KEY,
        );
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        const saltRounds = 2;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(originalText, salt);
        await this.usersModel
          .findByIdAndUpdate(
            user._id,
            {
              password: hash,
              resetTokenExpires: currentTime,
            },
            {
              new: true,
            },
          )
          .exec();
        return {
          successed: true,
          status: 'success',
          message: 'Password change successfully',
        };
      } else {
        throw new HttpException(
          {
            message:
              'Failed to update. Try again later. Note: URL expires 10 minutes after clicking.',
            successed: false,
            status: 'fail',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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
            successed: false,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async logout(authtoken: string): Promise<{
    successed: boolean;
    status: string;
    message: string;
  }> {
    try {
      const user = await this.usersTokenModel
        .findOne({
          token: authtoken,
        })
        .exec();
      if (user) {
        const now = new Date();
        await this.usersTokenModel
          .findByIdAndUpdate(
            user._id,
            {
              isLogin: false,
              tokenExpires: now,
            },
            {
              new: true,
            },
          )
          .exec();
        return {
          successed: true,
          status: 'success',
          message: 'Logout Successfully',
        };
      } else {
        throw new HttpException(
          {
            message: 'Failed to update user record.',
            successed: false,
            status: 'fail',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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
            successed: false,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
