import { Type } from 'class-transformer';
import { IsUUID, IsOptional, IsInt, Min } from 'class-validator';

export class FindComentariosQueryDto {
  @IsUUID()
  contenidoId: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limite?: number = 10;
}