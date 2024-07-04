export class CreateFeriadoDto {
    nome: string
    data: Date
    descricao: string
    nivel: string
    tipo: string
}

export class Log{
    id_feriado: string
    estado: JSON
    id_usuario: string
}
