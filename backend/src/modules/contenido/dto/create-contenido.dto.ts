import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsUUID,
  IsArray,
  ValidateNested,
  MaxLength,
  Matches,
  Min,
  Max,
  ArrayMaxSize,
} from 'class-validator';

class EnlaceExternoDto {
  @IsString()
  @MaxLength(60)
  etiqueta: string;

  @IsString()
  @MaxLength(500)
  url: string;
}

class ImagenInputDto {
  @IsString()
  @MaxLength(500)
  url: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  textoAlternativo?: string;

  @IsOptional()
  @IsInt()
  orden?: number;
}

class VideoInputDto {
  @IsString()
  @MaxLength(20)
  youtubeVideoId: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  titulo?: string;

  @IsOptional()
  @IsInt()
  orden?: number;
}

export class CreateContenidoDto {
  @IsString()
  @MaxLength(200)
  titulo: string;

  @IsString()
  @MaxLength(220)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug debe ser kebab-case',
  })
  slug: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  anio?: number;

  @IsUUID()
  decadaId: string;

  @IsUUID()
  categoriaId: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => EnlaceExternoDto)
  enlacesExternos?: EnlaceExternoDto[];

  @IsOptional()
  @IsBoolean()
  publicado?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImagenInputDto)
  imagenes?: ImagenInputDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VideoInputDto)
  videos?: VideoInputDto[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  etiquetaIds?: string[];
}