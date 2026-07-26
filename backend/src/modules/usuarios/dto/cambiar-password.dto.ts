import { IsString, MaxLength, MinLength } from 'class-validator';

export class CambiarPasswordDto {
  @IsString()
  passwordActual: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72) // bcrypt trunca/ignora lo que exceda 72 bytes
  passwordNueva: string;
}