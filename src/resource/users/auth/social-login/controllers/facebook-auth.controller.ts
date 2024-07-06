import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';
import { UsersService } from 'src/resource/users/users.service';
import { AuthService } from '../../auth.service';

@Controller('auth/facebook')
export class FacebookAuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post()
  async authenticateWithFacebook(@Body() body: { accessToken: string }) {
    try {
      const { accessToken } = body;

      // Verify access token with Facebook
      const debugTokenResponse = await axios.get(
        'https://graph.facebook.com/debug_token',
        {
          params: {
            input_token: accessToken,
            access_token: `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`,
          },
        },
      );

      const { is_valid } = debugTokenResponse.data.data;
      if (!is_valid) {
        throw new HttpException(
          'Invalid access token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Retrieve user data from Facebook
      const userDataResponse = await axios.get(
        'https://graph.facebook.com/me',
        {
          params: {
            fields: 'id,name,email,picture',
            access_token: accessToken,
          },
        },
      );

      const userData = userDataResponse.data;
      const { email } = userData;
      const isUser = await this.usersService.findOne(email);

      if (!isUser) {
        // You can throw a custom exception here if needed
        throw new HttpException(
          {
            message: 'Please Sign up first and try again',
          },
          HttpStatus.OK,
        );
      }
      const signIn = await this.authService.autoLogin(
        isUser.data._id.toString(),
      );
      return { success: true, user: signIn };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to authenticate with Facebook',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
