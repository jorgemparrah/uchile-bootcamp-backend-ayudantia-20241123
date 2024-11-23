import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { HashingService } from 'src/seguridad/service/hashing.service';
import { Usuario } from '../entities/usuario.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsuarioExistePipe implements PipeTransform {

  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>
  ) {
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    const id = await this.usuarioModel.exists({ username: value.username });
    if (id) {
      throw new BadRequestException('El usuario ya existe');
    }
    return value;
  }
}
