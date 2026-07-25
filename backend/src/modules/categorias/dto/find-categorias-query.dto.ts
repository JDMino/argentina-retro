import { IsOptional, IsUUID } from 'class-validator';

export class FindCategoriasQueryDto {
  @IsOptional()
  @IsUUID()
  decadaId?: string;
}