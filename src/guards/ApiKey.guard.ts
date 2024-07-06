import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { companyService } from 'src/resource/company/company.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private companyService: companyService,
        private configService: ConfigService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['api-key']; // This is how you access the header
        if (!apiKey) {
            throw new BadRequestException('API key is missing');
        }

        const company = await this.companyService.validateApiKey(apiKey);
        if (!company || !company.apiToken) {
            throw new UnauthorizedException('Invalid API key');
        }
        // Attach the company data to the request object
        request.company = company;

        return true;
    }
}
