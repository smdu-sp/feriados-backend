import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FeriadosService } from './feriados.service';
import { CreateFeriadoDto } from './dto/create-feriado.dto';
import { UpdateFeriadoDto } from './dto/update-feriado.dto';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import { Log } from './dto/create-feriado.dto';
import { UsuarioAtual } from 'src/auth/decorators/usuario-atual.decorator';
import { Usuario } from '@prisma/client';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('feriados')
export class FeriadosController {
  constructor(private readonly feriadosService: FeriadosService) {}

  @Permissoes('DEV', 'ADM')
  @Post('criar')
  create(@Body() createFeriadoDto: CreateFeriadoDto, log: Log, @UsuarioAtual() usuario: Usuario) {
    return this.feriadosService.create(createFeriadoDto, log, usuario.id);
  }

  @IsPublic()
  @Get('buscar')
  findAll() {
    return this.feriadosService.findAll();
  }

  @IsPublic()
  @Get('data/:data')
  findOne(@Param('data') data: string) {
    var novaData = new Date(data)
    return this.feriadosService.findOne(novaData);
  }

  @IsPublic()
  @Get('ano/:ano')
  buscarAno(@Param('ano') ano: string) {
    return this.feriadosService.buscarAno(+ano);
  }

  @Permissoes('DEV', 'ADM')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeriadoDto: UpdateFeriadoDto) {
    return this.feriadosService.update(id, updateFeriadoDto);
  }

  @Permissoes('DEV', 'ADM')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feriadosService.remove(+id);
  }
}
