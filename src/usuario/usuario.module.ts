import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario, UsuarioSchema } from './entities/usuario.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { SeguridadModule } from 'src/seguridad/seguridad.module';
import { JwtModule } from '@nestjs/jwt';
import { UsuarioRepository } from './usuario.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Usuario.name, schema: UsuarioSchema
    }]),
    SeguridadModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY, // LLAVE SECRETA
      signOptions: { expiresIn: '2m' }, // TIEMPO DE EXPIRACION
    })
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService, UsuarioRepository],
})
export class UsuarioModule {}
