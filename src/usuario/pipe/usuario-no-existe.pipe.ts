import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class UsuarioNoExistePipe implements PipeTransform {

  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>
  ) {
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    console.log(metadata.metatype.name);
    const id = await this.usuarioModel.exists({ username: value.username });
    if (!id) {
      if (metadata.metatype.name === "LoginUsuarioDto") {
        throw new UnauthorizedException("Credenciales incorrectas");
      } else {
        throw new NotFoundException("Usuario no existe");
      }
    }
    return value;
  }
}
