import { Module } from '@nestjs/common';
import { TransaccionService } from './transaccion.service';
import { TransaccionController } from './transaccion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from 'src/usuario/entities/usuario.entity';
import { Cuenta, CuentaSchema } from './entities/cuenta.entity';
import { Transaccion, TransaccionSchema } from './entities/transaccion.entity';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReporteTipoTransaccion } from 'src/orm/entity/reporte-tipo-transaccion.entity';
import { ReporteSaldos } from 'src/orm/entity/reporte-saldos.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Usuario.name, schema: UsuarioSchema
    },{
      name: Cuenta.name, schema: CuentaSchema
    },{
      name: Transaccion.name, schema: TransaccionSchema
    }]),
    TypeOrmModule.forFeature([
      ReporteTipoTransaccion,
      ReporteSaldos,
    ])
  ],
  controllers: [TransaccionController],
  providers: [TransaccionService],
})
export class TransaccionModule {}
