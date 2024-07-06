// src/recaptcha/recaptcha.service.ts

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RecaptchaService {
  private readonly apiUrl: string;
  private readonly secretKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('RECAPTCHA_API_URL');
    this.secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');
  }

  async verify(token: string, remoteip: string): Promise<boolean> {
    try {
      const params = new URLSearchParams({
        secret: this.secretKey,
        response: token,
        remoteip: remoteip,
      });

      const response = await this.httpService
        .post(`${this.apiUrl}?${params.toString()}`)
        .toPromise();
      if (response.status !== 200) {
        throw new Error(
          `reCAPTCHA verification failed with status code ${response.status}`,
        );
      }

      const data = response.data;

      if (!data.success) {
        console.error('reCAPTCHA error codes:', data['error-codes']);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error during reCAPTCHA verification:', error);
      return false;
    }
  }
}
