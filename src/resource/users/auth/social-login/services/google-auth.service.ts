import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/resource/users/users.service';
import { AuthService } from '../../auth.service';
import { OAuth2Client } from 'google-auth-library';
@Injectable()
export class GoogleAuthService {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private client: OAuth2Client,
  ) {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET_KEY,
      process.env.GOOGLE_REDIRECT_URI,
    );
  }

  getGoogleAuthUrl(): string {
    const url = this.client.generateAuthUrl({
      access_type: 'offline', // 'offline' to get a refresh token
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/calendar.readonly',
      ],
    });
    return url;
  }

  async exchangeAuthCodeForTokens(authCode: string): Promise<any> {
    try {
      console.log('Received auth code for exchange:', authCode); // Log the auth code being exchanged
      const { tokens } = await this.client.getToken(authCode);
      console.log('Tokens:', tokens);
      return tokens;
    } catch (error) {
      console.error(
        'Error exchanging auth code for tokens:',
        error.response?.data || error.message,
      );
      throw new HttpException('Invalid auth code', HttpStatus.BAD_REQUEST);
    }
  }

  async verifyIdToken(idToken: string): Promise<any> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      // const userId = payload['sub'];
      // Handle your user logic here with payload info
      return payload;
    } catch (error) {
      console.error('Error verifying ID token:', error);
      throw new HttpException('Invalid ID token', HttpStatus.UNAUTHORIZED);
    }
  }

  async googleHandler(credential: string) {
    try {
      // Verify the token with Google
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`,
      );

      const userData = await response.json();
      // Check if the token's audience matches your client ID
      if (userData.aud !== process.env.GOOGLE_CLIENT_ID) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      const isUser = await this.usersService.findOne(userData.email);
      if (!isUser) {
        throw new HttpException(
          { message: 'Please create your account before login' },
          HttpStatus.OK,
        );
      }
      if (isUser.data.isActive) {
        const signIn = await this.authService.autoLogin(
          isUser.data._id.toString(),
        );
        return { success: true, user: signIn };
      } else {
        throw new Error(`user not found: ${userData}`);
      }
    } catch (error) {
      throw new HttpException(
        'Failed to authenticate with Google',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
