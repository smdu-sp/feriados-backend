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
  @Get('data/:data1')
  findOne(@Param('data1') data1: string) {
    return this.feriadosService.findOne(new Date(data1));
  }
  
  @IsPublic()
  @Get('data/:data1/:data2')
  buscaDatas(@Param('data1') data1: string, @Param('data2') data2?: string) {
    return this.feriadosService.findOne(new Date(data1), new Date(data2));
  }

  @IsPublic()
  @Get('ano/:ano')
  buscarAno(@Param('ano') ano: string) {
    return this.feriadosService.buscarAno(+ano);
  }

  @Permissoes('DEV', 'ADM')
  @Patch('atualizar/:data')
  atualizar(@Param('data') dataUp: Date, @Body() updateFeriadoDto: UpdateFeriadoDto, @UsuarioAtual() usuario: Usuario) {
    return this.feriadosService.atualizar(dataUp, updateFeriadoDto, usuario.id);
  }

  @Patch('status/:id')
  desativar(@Param('id') id: string) {
    return this.feriadosService.desativar(id);
  }

  @Delete('deletar/:id')
  deletar(@Param('id') id: string){
    return this.feriadosService.delete(id);
  }

  @Permissoes('ADM', 'DEV')
  @Post('gerarFeriado')
  gerarDataRecorrente(){
    return this.feriadosService.gerarDataRecorrente();
  }

  @IsPublic()
  @Get('feriados-inativos')
  buscarFeriadosInativos(){
    return this.feriadosService.buscarFeriadosInativos();
  }

  @IsPublic()
  @Get('recorrentes')
  buscarFeriadosRecorrente(){
    return this.feriadosService.buscarFeriadosRecorrente();
  }

  @Permissoes('ADM', 'DEV')
  @Patch('status-recorrentes/:id')
  desativarRecorrentes(@Param('id') id: string) {
    return this.feriadosService.desativarRecorrentes(id);
  }
}
