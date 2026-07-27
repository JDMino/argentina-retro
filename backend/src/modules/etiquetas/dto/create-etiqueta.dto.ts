import { IsString, MaxLength, Matches } from 'class-validator';

export class CreateEtiquetaDto {
  @IsString()
  @MaxLength(60)
  nombre: string;

  @IsString()
  @MaxLength(60)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug debe ser kebab-case (ej: rock-nacional)',
  })
  slug: string;
}