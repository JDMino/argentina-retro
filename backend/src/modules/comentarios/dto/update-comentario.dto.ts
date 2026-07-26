import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateComentarioDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  texto: string;
}