import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsUrl,
  Min,
  Max,
  MaxLength,
  Matches,
  IsObject,
} from 'class-validator';

export class CreateDecadaDto {
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug debe ser kebab-case (ej: los-80)',
  })
  slug: string;

  @IsInt()
  @Min(1900)
  @Max(2100)
  anioInicio: number;

  @IsInt()
  @Min(1900)
  @Max(2100)
  anioFin: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsObject()
  paleta?: Record<string, string>;

  @IsOptional()
  @IsUrl({}, { message: 'imagenFondoDesktopUrl debe ser una URL válida' })
  imagenFondoDesktopUrl?: string | null;

  @IsOptional()
  @IsUrl({}, { message: 'imagenFondoMobileUrl debe ser una URL válida' })
  imagenFondoMobileUrl?: string | null;

  @IsOptional()
  @IsInt()
  orden?: number;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}