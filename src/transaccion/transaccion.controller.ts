import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransaccionService } from './transaccion.service';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { UpdateTransaccionDto } from './dto/update-transaccion.dto';

@Controller('transaccion')
export class TransaccionController {
  constructor(private readonly transaccionService: TransaccionService) {}

  @Post("cargaAutomatica")
  async cargaAutomatica() {
    return await this.transaccionService.cargarDatos();
  }

  @Post()
  async create(@Body() createTransaccionDto: CreateTransaccionDto) {
    return await this.transaccionService.create(createTransaccionDto);
  }

  @Post("cargaReportesInicial")
  async cargaReportes() {
    return await this.transaccionService.cargaReportes();
  }

}
