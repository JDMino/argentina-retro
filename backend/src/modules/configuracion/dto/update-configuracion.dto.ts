import { IsOptional, IsUrl } from 'class-validator';

export class UpdateConfiguracionDto {
  @IsOptional()
  @IsUrl({}, { message: 'homeFondoDesktopUrl debe ser una URL válida' })
  homeFondoDesktopUrl?: string | null;

  @IsOptional()
  @IsUrl({}, { message: 'homeFondoMobileUrl debe ser una URL válida' })
  homeFondoMobileUrl?: string | null;
}