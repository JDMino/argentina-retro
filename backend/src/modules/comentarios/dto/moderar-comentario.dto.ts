import { IsBoolean } from 'class-validator';

export class ModerarComentarioDto {
  @IsBoolean()
  aprobado: boolean;
}