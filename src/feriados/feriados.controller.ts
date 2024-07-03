import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FeriadosService } from './feriados.service';
import { CreateFeriadoDto } from './dto/create-feriado.dto';
import { UpdateFeriadoDto } from './dto/update-feriado.dto';

@Controller('feriados')
export class FeriadosController {
  constructor(private readonly feriadosService: FeriadosService) {}

  @Post()
  create(@Body() createFeriadoDto: CreateFeriadoDto) {
    return this.feriadosService.create(createFeriadoDto);
  }

  @Get()
  findAll() {
    return this.feriadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feriadosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeriadoDto: UpdateFeriadoDto) {
    return this.feriadosService.update(+id, updateFeriadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feriadosService.remove(+id);
  }
}
