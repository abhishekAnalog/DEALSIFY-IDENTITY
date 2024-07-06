import { SetMetadata } from '@nestjs/common';

export const ApiKey = () => SetMetadata('api-key', true);