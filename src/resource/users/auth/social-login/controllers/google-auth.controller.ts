import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../../../users.service';
import { AuthService } from '../../auth.service';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Post()
  async authenticateWithGoogle(@Body() body: { credential: string }) {
    try {
      // Verify the token with Google
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${body.credential}`,
      );

      const userData = await response.json();
      // Check if the token's audience matches your client ID
      if (userData.aud !== process.env.GOOGLE_CLIENT_ID) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      const isUser = (await this.usersService.findOne(userData.email)) as any;
      // if (isUser.data.isActive) {
      console.log('inside if user is active', isUser.data.isActive);
      const signIn = await this.authService.autoLogin(
        isUser.data._id.toString(),
      );
      // }
      // Handle user authentication and authorization in your NestJS application
      // You can create a new user account, update an existing user's information, generate JWT token, etc.
      return { success: true, user: signIn };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to authenticate with Google',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
