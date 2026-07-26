import { IsUUID } from 'class-validator';

export class FindComentariosQueryDto {
  @IsUUID()
  contenidoId: string;
}