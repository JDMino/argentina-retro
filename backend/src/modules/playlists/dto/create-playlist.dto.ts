import { IsString, IsOptional, MaxLength, IsUUID } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @MaxLength(150)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  youtubePlaylistId?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsUUID()
  decadaId?: string;

  @IsOptional()
  @IsUUID()
  categoriaId?: string;
}