import { Type } from 'class-transformer';
import { IsOptional, IsUUID, IsInt, Min, IsBoolean } from 'class-validator';

export class FindContenidoQueryDto {
  @IsOptional()
  @IsUUID()
  decadaId?: string;

  @IsOptional()
  @IsUUID()
  categoriaId?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  publicado?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limite?: number = 20;
}