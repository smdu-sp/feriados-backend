import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateFeriadoDto } from './dto/create-feriado.dto';
import { Log } from './dto/create-feriado.dto';
import { UpdateFeriadoDto } from './dto/update-feriado.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';
import { equal } from 'assert';
import { equals } from 'class-validator';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class FeriadosService {
  constructor(
    private prisma: PrismaService,
    private app: AppService
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

  findAll() {
    const buscarTudo = this.prisma.feriados.findMany({
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
      orderBy: {
        data: 'desc'
      }
    });
    if (!buscarTudo) { throw new ForbiddenException('Não foi possivel encontrar feriados') }
    return buscarTudo;
  }

  async findOne(data: Date) {
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
          { data: { gte: data } },
          { data: { lte: data } }
        ]
      }
    });
    if (!buscaData) { throw new ForbiddenException('Não foi possivel encontrar feriados') }
    return buscaData
  }

  async buscarAno(ano: number) {
    const busca_ano = this.prisma.feriados.findMany({
      where: {
        AND: [
          { data: { gte: new Date(`${ano}-01-01`) } },
          { data: { lt: new Date(`${ano + 1}-01-01`) } }
        ]
      },
      orderBy: {
        data: 'asc'
      }
    })
    if (!busca_ano) { throw new ForbiddenException('Não foi possivel encontrar feriados') }
    return busca_ano;
  }

  async atualizar(dataUp: Date, updateFeriadoDto: UpdateFeriadoDto, usuario_id: string) {
    const { nome, data, descricao, nivel, tipo, modo, status } = updateFeriadoDto
    let dataformatada = dataUp + 'T00:00:00.000Z'
    const feriado = await this.prisma.feriados.update({
      where: {
        data: dataformatada
      },
      data: {
        nome, data, descricao, nivel, tipo, modo, status
      }
    })
    if (modo === 0) {
      if (!feriado) { throw new ForbiddenException('Não foi possivel encontrar feriados') }
      const feriadoRecorrente = await this.prisma.recorrente.update({
        where: {
          data: dataformatada
        },
        data: {
          nome, data, descricao, nivel, tipo, modo, status
        }
      })
      if (!feriado) { throw new ForbiddenException('Não foi possivel encontrar feriados') }
      await this.gera_log(feriado.id, feriado, usuario_id)
      return [feriado, feriadoRecorrente]
    }
    await this.gera_log(feriado.id, feriado, usuario_id)
    return [feriado]
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

  async desativar(id: string) {
    const feriadoAlvo = this.prisma.feriados.findUnique({
      where: { id },
      select: { id: true, status: true }
    }) 
    const feriado = this.prisma.feriados.update({
      where: {id: (await feriadoAlvo).id},
      data: {status: (await feriadoAlvo).status === 1 ? 0 : 1}
    });
    if (!feriado) throw new ForbiddenException("Não foi possivel desativar este feriado")
    return feriado;
  }

  async delete(id: string) {
    const feriado = this.prisma.feriados.delete({
      where: { id }
    })
    if (!feriado) throw new ForbiddenException("Não foi possivel deletar este feriado")
    return feriado
  }

  
  @Cron(CronExpression.EVERY_YEAR)
  async gerarDataRecorrente() {
    const recorrentes = await this.prisma.recorrente.findMany({
      select: {
        nome: true,
        data: true,
        descricao: true,
        nivel: true,
        tipo: true,
        status: true,
        modo: true
      }
    });

    const ano = new Date().getFullYear() + 1;

    const feriados = recorrentes.map(feriados => ({
      nome: feriados.nome,
      data: new Date(ano, feriados.data.getMonth(), feriados.data.getDate() + 1),
      descricao: feriados.descricao,
      nivel: feriados.nivel,
      tipo: feriados.tipo,
      status: feriados.status,
      modo: feriados.modo
    }));
    const result = await this.prisma.feriados.createMany({
      data: feriados
    });

    console.log("Foi");

    return result;
  }
}
