import { Injectable } from '@nestjs/common';
import { Usuario } from './entities/usuario.entity';
import { Estado } from './enum/estado.enum';

@Injectable()
export class UsuarioRepository {

  usuarios : Usuario[] = [];

  constructor() {
    const usuario1 = new Usuario();
    usuario1.username = 'admin';
    usuario1.password = 'admin';
    usuario1.rol = 'ADMIN';
    usuario1.estado = Estado.ACTIVO;
    this.usuarios.push(usuario1);

    const usuario2 = new Usuario();
    usuario2.username = 'usuario';
    usuario2.password = 'usuario';
    usuario2.rol = 'USUARIO';
    usuario2.estado = Estado.ACTIVO;
    this.usuarios.push(usuario2);

  }

  findOne(input: any) : Usuario {
    const usuario = this.usuarios.find(usuario => usuario.username === input.username);
    return usuario;
  }

}
