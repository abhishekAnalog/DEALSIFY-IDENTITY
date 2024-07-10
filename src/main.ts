import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { readFileSync } from 'fs';

async function bootstrap() {
  // const httpsOptions = {
  //   key: readFileSync('/etc/letsencrypt/live/nodejsapi.in/privkey.pem'),
  //   cert: readFileSync('/etc/letsencrypt/live/nodejsapi.in/fullchain.pem'),
  // };

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      // httpsOptions,
    },
  );
  app.setGlobalPrefix('identity/api');
  app.enableCors({
    origin: [
      'https://accounts.google.com',
      'https://localhost:3000',
      'http://localhost:3000',
      'http://localhost:5000',
      'https://ondemand.dealsify.in',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  const config = new DocumentBuilder()
    .setTitle('Identity Service')
    .setDescription(
      'API for managing user identities, authentication, and authorization.',
    )
    .setVersion('1.0')
    .addTag('identity')
    .build();
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const port = process.env.IDENTITY_PORT ?? 6666;

  await app.listen(port);

  console.log(`🚀 Project is running on port ${port}`);
}
bootstrap();
