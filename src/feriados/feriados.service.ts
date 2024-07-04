import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateFeriadoDto } from './dto/create-feriado.dto';
import { Log } from './dto/create-feriado.dto';
import { UpdateFeriadoDto } from './dto/update-feriado.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';
import { equal } from 'assert';
import { equals } from 'class-validator';

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

  async create(createFeriadoDto: CreateFeriadoDto, log: Log, usuario_id: string) {
    const { nome, data, descricao, nivel, tipo, modo, status } = createFeriadoDto
    const criar = await this.prisma.feriados.create({
      data: { nome, data, descricao, nivel, tipo, modo, status }
    })
    await this.gera_log(criar.id, criar, usuario_id)
    return criar;
  }

  findAll() {
    const buscarTudo = this.prisma.feriados.findMany({
      select: {
        nome: true,
        data: true,
        descricao: true,
        nivel: true,
        tipo: true
      }
    });
    if (!buscarTudo) { throw new ForbiddenException('Não foi possivel encontrar feriados') }
    return buscarTudo;
  }

  async findOne(data: Date) {
    const buscaData = await this.prisma.feriados.findMany({
      select: {
        nome: true,
        data: true,
        descricao: true,
        nivel: true,
        tipo: true
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

  async update(id: string, updateFeriadoDto: UpdateFeriadoDto) {
    const feriado = await this.prisma.feriados.findUnique({
      where: { id }, select: { modo: true, data: true }
    })
    if (feriado.modo === 0) {
      const atualizar_feriado = await this.prisma.feriados.updateMany({
        where: {
          AND: [
            {
              data: {
                
              },
            },
          ],
        },
        data: updateFeriadoDto
      })
      if (atualizar_feriado) { throw new ForbiddenException('Não possivel atualizar este feriado') }
    } else {
      const atualizar_feriado = await this.prisma.feriados.updateMany({
        where: {
          id: { equals: id }
        },
        data: updateFeriadoDto
      })
      if (atualizar_feriado) { throw new ForbiddenException('Não possivel atualizar este feriado') }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} feriado`;
  }
}
