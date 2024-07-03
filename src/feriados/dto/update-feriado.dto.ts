import { PartialType } from '@nestjs/swagger';
import { CreateFeriadoDto } from './create-feriado.dto';

export class UpdateFeriadoDto extends PartialType(CreateFeriadoDto) {}
