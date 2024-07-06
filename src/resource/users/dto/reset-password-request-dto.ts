import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordRequestDto {
  @IsNotEmpty()
  @IsString()
  readonly token: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
