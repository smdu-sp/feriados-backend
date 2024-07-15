import { Module } from '@nestjs/common';
import { FeriadosService } from './feriados.service';
import { FeriadosController } from './feriados.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [FeriadosController],
  providers: [FeriadosService],
  imports: [
    ScheduleModule.forRoot()
  ],
})
export class FeriadosModule {}
