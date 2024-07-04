import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateFeriadoDto } from './dto/create-feriado.dto';
import { UpdateFeriadoDto } from './dto/update-feriado.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';
import { equal } from 'assert';

@Injectable()
export class FeriadosService {
  constructor(
    private prisma: PrismaService,
    private app: AppService
  ) { }



  async create(createFeriadoDto: CreateFeriadoDto) {
    const { nome, data, descricao, nivel, tipo } = createFeriadoDto
    const criar = await this.prisma.feriados.create({
      data: { nome, data, descricao, nivel, tipo }
    })
    if (!criar) { throw new ForbiddenException('Não foi possivel regegistrar o feriado') }
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

  findOne(data: Date) {
    const buscaData = this.prisma.feriados.findMany({
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

  update(id: number, updateFeriadoDto: UpdateFeriadoDto) {
    return `This action updates a #${id} feriado`;
  }

  remove(id: number) {
    return `This action removes a #${id} feriado`;
  }
}
