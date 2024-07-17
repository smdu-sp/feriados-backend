import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FeriadosService } from './feriados.service';
import { CreateFeriadoDto } from './dto/create-feriado.dto';
import { UpdateFeriadoDto } from './dto/update-feriado.dto';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import { UsuarioAtual } from 'src/auth/decorators/usuario-atual.decorator';
import { Usuario } from '@prisma/client';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('feriados')
export class FeriadosController {
  constructor(private readonly feriadosService: FeriadosService) { }

  @IsPublic()
  @Get("buscarTudo")
  buscarTudo(
    @Query('status') status?: string,
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
    @Query('busca') busca?: string,
  ) {
    return this.feriadosService.buscarTudo(+pagina, +limite, busca, +status);
  }

  @Permissoes('DEV', 'ADM')
  @Post('criar')
  create(@Body() createFeriadoDto: CreateFeriadoDto, @UsuarioAtual() usuario: Usuario) {
    return this.feriadosService.create(createFeriadoDto, usuario.id);
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
  @Get("ano/:ano")
  buscaAno(
    @Param('ano') ano: string,
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
    @Query('busca') busca?: string,
    @Query('status') status?: string
  ) {
    return this.feriadosService.buscarAno(+ano, +pagina, +limite, busca, +status);
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
  deletar(@Param('id') id: string) {
    return this.feriadosService.delete(id);
  }

  @Permissoes('ADM', 'DEV')
  @Post('gerarFeriado')
  gerarDataRecorrente() {
    return this.feriadosService.gerarDataRecorrente();
  }

  @IsPublic()
  @Get('recorrentes')
  buscarFeriadosRecorrente(
    @Query('status') status?: string,
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
    @Query('busca') busca?: string,
  ) {
    return this.feriadosService.buscarFeriadosRecorrente(+status, +pagina, +limite, busca);
  }

  @Permissoes('ADM', 'DEV')
  @Patch('recorrentes/status/:id')
  desativarRecorrentes(@Param('id') id: string) {
    return this.feriadosService.statusRecorrentes(id);
  }

  @IsPublic()
  @Get("recorrente/:id")
  buscarRecorrenteId(@Param("id") id: string) {
    return this.feriadosService.buscarRecorrenteId(id)
  }

  @IsPublic()
  @Patch("recorrente/atualizar/:id")
  atualizarRecorrente(@Param("id") id: string, @Body() updateFeriadoDto: UpdateFeriadoDto) {
    return this.feriadosService.atualizarRecorrente(id, updateFeriadoDto)
  }
}
