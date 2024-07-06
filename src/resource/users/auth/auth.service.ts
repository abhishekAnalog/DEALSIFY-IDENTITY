import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { authRepository } from './auth.respository';
import * as CryptoJS from 'crypto-js';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly authRepository: authRepository,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{
    data: {};
    succeeded: boolean;
    message: string;
    status: string;
  }> {
    try {
      const user = await this.usersService.findOne(username);
      if (!user) {
        throw new UnauthorizedException();
      }
      // Decrypt
      const bytes = CryptoJS.AES.decrypt(
        password,
        process.env.PASSWORD_SECRET_KEY,
      );
      const originalText = bytes.toString(CryptoJS.enc.Utf8);

      const isMatch = await bcrypt.compare(originalText, user.data.password);
      if (!isMatch) {
        throw new UnauthorizedException();
      }
      const payload = {
        id: user.data._id,
        username: user.data.name,
        companyId: user.data.company_id,
      };
      const accessToken = await this.jwtService.signAsync(payload);
      const setQuery = {
        companyId: user.data.company_id,
        isLogin: true,
        token: accessToken,
        tokenCreated: new Date(),
        tokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        userId: user.data._id,
      };
      await this.authRepository.create(setQuery);
      return {
        data: {
          access_token: accessToken,
          user_id: payload.id.toString(),
          name: payload.username,
          email: user.data.email,
          phoneNumber: user.data.phoneNumber,
          company_id: user.data.company_id,
          role: user.data.role,
        },
        succeeded: true,
        message: "Welcome, You've logged in successfully!",
        status: 'success',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new HttpException(
          {
            message:
              'Invalid credentials. Please check your email and password and try again.',
            stack: error.stack,
            name: error.name,
            err: error.message,
            succeeded: false,
            status: 'fail',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw error; // rethrow other unexpected errors
    }
  }

  async autoLogin(id: string): Promise<{
    data: {};
    succeeded: boolean;
    message: string;
    status: string;
  }> {
    const user = await this.usersService.findById(id);
    const payload = {
      id: user._id,
      username: user.name,
      companyId: user?.company_id,
    };
    await this.jwtService.signAsync(payload);
    return {
      data: {
        access_token: await this.jwtService.signAsync(payload),
        user_id: payload.id.toString(),
        name: payload.username,
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        company_id: user?.company_id,
        role: user?.role,
      },
      succeeded: true,
      message: "Welcome, You've logged in successfully!",
      status: 'success',
    };
  }
}
