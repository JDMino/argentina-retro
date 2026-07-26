import { IsString, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateComentarioDto {
  @IsUUID()
  contenidoId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  texto: string;
}