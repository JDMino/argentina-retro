import { Transform, Type } from 'class-transformer';
import { IsOptional, IsUUID, IsInt, Min, IsBoolean, IsString, MaxLength } from 'class-validator';

export class FindComentariosAdminQueryDto {
  @IsOptional()
  @IsUUID()
  contenidoId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  aprobado?: boolean;

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