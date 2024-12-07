import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReporteTipoTransaccion } from './entity/reporte-tipo-transaccion.entity';
import { ReporteSaldos } from './entity/reporte-saldos.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_NAME,
      entities: [
        ReporteTipoTransaccion,
        ReporteSaldos,
      ]
    })
  ]
})
export class OrmModule {}
