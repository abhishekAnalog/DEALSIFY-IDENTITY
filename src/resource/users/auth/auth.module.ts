import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { authRepository } from './auth.respository';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersTokenSchema } from './schemas/usertoken.schema';
import { GoogleAuthController } from './social-login/controllers/google-auth.controller';
import { FacebookAuthController } from './social-login/controllers/facebook-auth.controller';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
    MongooseModule.forFeature([
      {
        name: 'UserTokens',
        schema: UsersTokenSchema,
      },
    ]),
  ],
  providers: [AuthService, authRepository],
  controllers: [AuthController, GoogleAuthController, FacebookAuthController],
  exports: [AuthService],
})
export class AuthModule {}
