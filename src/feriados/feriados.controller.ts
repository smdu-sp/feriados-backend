import { Controller, Get, Param } from '@nestjs/common';
import { FeriadosService } from './feriados.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('feriados')
export class FeriadosController {
  constructor(private readonly feriadosService: FeriadosService) { }

  @IsPublic()
  @Get("geral")
  buscarTudo(
  ) {
    return this.feriadosService.buscarTudo();
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
    @Param('ano') ano: string
  ) {
    return this.feriadosService.buscarAno(+ano);
  }

  @IsPublic()
  @Get("nome/:nome")
  buscarPorNome(
    @Param('nome') nome: string
  ){
    return this.feriadosService.buscarPorNome(nome)
  }
}
