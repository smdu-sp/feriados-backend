import { Module } from '@nestjs/common';
import { FeriadosService } from './feriados.service';
import { FeriadosController } from './feriados.controller';

@Module({
  controllers: [FeriadosController],
  providers: [FeriadosService],
})
export class FeriadosModule {}
