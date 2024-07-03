import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FeriadosService } from './feriados.service';
import { CreateFeriadoDto } from './dto/create-feriado.dto';
import { UpdateFeriadoDto } from './dto/update-feriado.dto';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';

@Controller('feriados')
export class FeriadosController {
  constructor(private readonly feriadosService: FeriadosService) {}

  @Permissoes('DEV', 'ADM')
  @Post('criar')
  create(@Body() createFeriadoDto: CreateFeriadoDto) {
    return this.feriadosService.create(createFeriadoDto);
  }

  @Get('buscar')
  findAll() {
    return this.feriadosService.findAll();
  }

  @Get('data/:data')
  findOne(@Param('data') data: string) {
    var novaData = new Date(data)
    return this.feriadosService.findOne(novaData);
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
