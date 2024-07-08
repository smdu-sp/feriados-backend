import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FeriadosService } from './feriados.service';
import { CreateFeriadoDto } from './dto/create-feriado.dto';
import { UpdateFeriadoDto } from './dto/update-feriado.dto';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import { UsuarioAtual } from 'src/auth/decorators/usuario-atual.decorator';
import { Usuario } from '@prisma/client';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('feriados')
export class FeriadosController {
  constructor(private readonly feriadosService: FeriadosService) {}

  @Permissoes('DEV', 'ADM')
  @Post('criar')
  create(@Body() createFeriadoDto: CreateFeriadoDto, @UsuarioAtual() usuario: Usuario) {
    return this.feriadosService.create(createFeriadoDto, usuario.id);
  }

  @IsPublic()
  @Get('buscar')
  findAll() {
    return this.feriadosService.findAll();
  }

  @IsPublic()
  @Get('data/:data')
  findOne(@Param('data') data: string) {
    var novaData = new Date(data);
    return this.feriadosService.findOne(novaData);
  }

  @IsPublic()
  @Get('ano/:ano')
  buscarAno(@Param('ano') ano: string) {
    return this.feriadosService.buscarAno(+ano);
  }

  @Permissoes('DEV', 'ADM')
  @Patch('atualizar/:data')
  atualizar(@Param('data') dataUp: Date, @Body() updateFeriadoDto: UpdateFeriadoDto) {
    return this.feriadosService.atualizar(dataUp, updateFeriadoDto);
  }

  @Post('gera-feriados-ano')
  tarefa_recorrente() {
    console.log("Tarefa recorrente executada");
    return this.feriadosService.tarefa_recorrente();
  }
}
