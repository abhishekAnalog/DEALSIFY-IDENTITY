import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../../guards/auth.guard';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(
      signInDto.email,
      signInDto.password,
      signInDto.captcha,);
  }
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('auto-login')
  autoLogin(@Body() id: string) {
    return this.authService.autoLogin(id);
  }
}
