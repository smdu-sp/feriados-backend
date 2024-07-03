import { Injectable } from '@nestjs/common';
import { CreateFeriadoDto } from './dto/create-feriado.dto';
import { UpdateFeriadoDto } from './dto/update-feriado.dto';

@Injectable()
export class FeriadosService {
  create(createFeriadoDto: CreateFeriadoDto) {
    return 'This action adds a new feriado';
  }

  findAll() {
    return `This action returns all feriados`;
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
