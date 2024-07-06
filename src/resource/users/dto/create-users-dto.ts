import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsString()
  readonly email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+1234567890',
  })
  @IsString()
  readonly phoneNumber: string;

  @ApiProperty({
    description: 'Financial year ID associated with the user',
    example: '2024FY',
  })
  @IsOptional()
  @IsString()
  readonly financialYearId: string;

  @ApiProperty({
    description: 'Username of the user',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  readonly userName: string;

  @ApiProperty({
    description: 'Image URL or base64 encoded image string',
    example: 'https://example.com/images/john.jpg',
  })
  @IsOptional()
  @IsString()
  readonly image: string;

  // The following properties are excluded from Swagger documentation and validation
  readonly reset_password_token: string;
  readonly reset_password_expires: number;
  readonly refresh_token: string;
}
