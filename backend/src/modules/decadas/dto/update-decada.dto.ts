import { PartialType } from '@nestjs/mapped-types';
import { CreateDecadaDto } from './create-decada.dto';

export class UpdateDecadaDto extends PartialType(CreateDecadaDto) {}