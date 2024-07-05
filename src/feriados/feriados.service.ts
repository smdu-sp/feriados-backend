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


  async tarefa_recorrente() {
    const recorrentes = await this.prisma.recorrente.findMany({
      where: {
        status: 1,
      },
      select: {
        nome: true,
        data: true,
        descricao: true,
        nivel: true,
        tipo: true,
        modo: true,
        status: true,
      },
    });

    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const feriadosData = recorrentes.map((recorrente) => {
      // Separa a data em dia e mês
      const partesData = recorrente.data.toString().split("-");
      const novaData = partesData[0]
      console.log(new Date(novaData).toString());
      
      // Constrói a data no formato ISO 8601
      const dataFormatada = `${anoAtual + 1}-${parseInt(partesData[1])}-${parseInt(partesData[0])}T00:00:00.00Z`;
    
      // Retorna um novo objeto com a data formatada
      return {
        nome: recorrente.nome,
        data: dataFormatada,
        descricao: recorrente.descricao,
        nivel: recorrente.nivel,
        tipo: recorrente.tipo,
        modo: recorrente.modo,
        status: recorrente.status,
      };
    });
    

    const registrarFeriados = await this.prisma.feriados.createMany({
      data: feriadosData,
    });

    return registrarFeriados;
  }


  findAll() {
    const buscarTudo = this.prisma.feriados.findMany({
      select: {
        nome: true,
        data: true,
        descricao: true,
        nivel: true,
        tipo: true
      },
      orderBy: {

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

  async buscarPorNome(nome: string) {

    const busca = this.prisma.feriados.findMany({
      where: {
        nome
      },
      select: {
        nome: true,
        data: true,
        descricao: true,
        nivel: true,
        tipo: true,
        status: true,
        modo: true
      }
    })

    if (!busca) throw new ForbiddenException('não foi possivel achar um feriado')

    return busca;
  }

  remove(id: number) {
    return `This action removes a #${id} feriado`;
  }
}
