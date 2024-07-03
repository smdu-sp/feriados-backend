import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateFeriadoDto } from './dto/create-feriado.dto';
import { UpdateFeriadoDto } from './dto/update-feriado.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';

@Injectable()
export class FeriadosService {
  constructor(
    private prisma: PrismaService,
    private app: AppService
  ) {}

  async create(createFeriadoDto: CreateFeriadoDto) {
    const { nome, data, descricao } = createFeriadoDto
    const criar = await this.prisma.feriados.create({
      data: {nome, data, descricao}
    })
    if (!criar) { throw new ForbiddenException('Não foi possivel regegistrar o feriado') }
    return criar;
  }

  findAll() {
    const buscarTudo = this.prisma.feriados.findMany({});
    if (!buscarTudo) { throw new ForbiddenException('Não foi possivel encontrar feriados')}
  }

  findOne(id: number) {
    return `This action returns a #${id} feriado`;
  }

  update(id: number, updateFeriadoDto: UpdateFeriadoDto) {
    return `This action updates a #${id} feriado`;
  }

  remove(id: number) {
    return `This action removes a #${id} feriado`;
  }
}
