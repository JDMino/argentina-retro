import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72) // bcrypt trunca/ignora lo que exceda 72 bytes
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;
}