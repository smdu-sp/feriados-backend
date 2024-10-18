import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateFeriadoDto } from './dto/create-feriado.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';
import { format } from 'path';

@Injectable()
export class FeriadosService {
  constructor(
    private prisma: PrismaService,
    private app: AppService,
  ) { }

  async gera_log(id_feriado: string, estado: any, id_usuario: string) {
    await this.prisma.log.create({
      data: { id_feriado, estado: estado, id_usuario }
    })
  }

  async create(createFeriadoDto: CreateFeriadoDto, usuario_id: string) {
    const { nome, data, descricao, nivel, tipo, modo, status } = createFeriadoDto
    if (modo === 0) {
      const recorrente = await this.prisma.recorrente.create({
        data: { nome, data, descricao, nivel, tipo, modo, status }
      });
      const feriado = await this.prisma.feriados.create({
        data: { nome, data, descricao, nivel, tipo, modo, status }
      })
      await this.gera_log(feriado.id, feriado, usuario_id)
      return [recorrente, feriado];
    } else {
      const criar = await this.prisma.feriados.create({
        data: { nome, data, descricao, nivel, tipo, modo, status }
      })
      await this.gera_log(criar.id, criar, usuario_id)
      return criar;
    }
  }

  async buscarTudo(
  ) {
    const feriados = await this.prisma.feriados.findMany({
      where: { status: 0 }
    });
    return { feriados };
  }

  async findOne(data1: Date, data2?: Date) {

    if (!data2 || !data1) throw new ForbiddenException('data não valida')

    const buscaData = await this.prisma.feriados.findMany({
      select: {
        id: true,
        nome: true,
        data: true,
        descricao: true,
        nivel: true,
        tipo: true,
        status: true,
        modo: true
      },
      where: {
        AND: [
          { data: { gte: data1 } },
          { data: { lte: data2 || data1 } }
        ]
      }
    });
    if (!buscaData) { throw new ForbiddenException('Não foi possivel encontrar feriados') }
    return data2 ? buscaData : buscaData.length > 0;
  }

  async buscarAno(
    ano: number
  ) {
    const feriados = await this.prisma.feriados.findMany({
      where: {
        status: 0,
        AND: [
          { data: { gte: new Date(`${ano}-01-01`) } },
          { data: { lt: new Date(`${ano + 1}-01-01`) } }
        ]
      }
    });
    return feriados;
  }

  async buscarPorNome(nome: string) {
    const busca = this.prisma.feriados.findMany({
      where: {
        nome
      },
      select: {
        id: true,
        nome: true,
        data: true,
        descricao: true,
        nivel: true,
        tipo: true,
        status: true,
        modo: true
      }
    })
    if (!busca) throw new ForbiddenException('Não foi possivel achar um feriado')
    return busca;
  }

  async buscarDiasUteis(data1: Date, data2: Date) {
    const buscaFeriado = await this.findOne(data1, data2);
    if (!buscaFeriado) { 
        throw new ForbiddenException('Não foi possível encontrar feriados'); 
    }
    
    console.log(data1.toLocaleDateString('pt-BR'));
    console.log(data2.toLocaleDateString('pt-BR'));

    const diasSemFds = [];

    let currentDate = new Date(data1);
    const endDate = new Date(data2);

    while (currentDate <= endDate) {

        if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0) {
            diasSemFds.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    const feriados = []
    if (Array.isArray(buscaFeriado)) feriados.push(...buscaFeriado.map(feriado => new Date(feriado.data)));

    const diasUteis = diasSemFds.filter(d => !feriados.some(f => f.toLocaleDateString('pt-BR') === d.toLocaleDateString('pt-BR')));

    return {
        diasUteis,
        quantidade: diasUteis.length,
        feriados
    };
}

}
