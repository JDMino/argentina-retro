import { IsOptional, IsUUID } from 'class-validator';

export class FindPlaylistsQueryDto {
  @IsOptional()
  @IsUUID()
  decadaId?: string;

  @IsOptional()
  @IsUUID()
  categoriaId?: string;
}