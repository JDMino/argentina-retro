import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';

export class FindDecadasQueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  activa?: boolean;
}