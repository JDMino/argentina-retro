import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePerfilDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}