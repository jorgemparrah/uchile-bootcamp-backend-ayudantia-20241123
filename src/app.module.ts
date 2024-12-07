import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeguridadModule } from './seguridad/seguridad.module';
import { TransaccionModule } from './transaccion/transaccion.module';
import { UsuarioModule } from './usuario/usuario.module';
import { OrmModule } from './orm/orm.module';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`),
    SeguridadModule,
    UsuarioModule,
    TransaccionModule,
    OrmModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
