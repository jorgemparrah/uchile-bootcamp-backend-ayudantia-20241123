import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { GetUsuarioDto } from './dto/get-usuario.dto';
import { JwtDto } from './dto/jwt.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Estado } from './enum/estado.enum';
import { JwtService } from '@nestjs/jwt';
import e from 'express';
import { ActualizarEstadoUsuarioDto } from './dto/actualizar-estado-usuario.dto';
import { UsuarioRepository } from './usuario.repository';

@Injectable()
export class UsuarioService {

  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
    private readonly jwtService: JwtService,
    private readonly usuarioModelPrueba: UsuarioRepository,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) : Promise<GetUsuarioDto> {
    const entity : Usuario = new Usuario();
    entity.username = createUsuarioDto.username;
    entity.password = createUsuarioDto.password;
    entity.rol = createUsuarioDto.rol;
    entity.estado = Estado.PENDIENTE;
    const guardado = await this.usuarioModel.create(entity);
    const dto = new GetUsuarioDto();
    dto.username = guardado.username;
    dto.rol = guardado.rol;
    dto.estado = guardado.estado;
    return dto;
  }

  async login(loginDto: LoginUsuarioDto) : Promise<JwtDto> {
    const usuario : Usuario = await this.usuarioModelPrueba.findOne({
      username: loginDto.username
    });
    if (usuario.estado !== Estado.ACTIVO) {
      throw new UnauthorizedException("Credenciales incorrectas");
    }
    if (loginDto.password !== usuario.password) {
      throw new UnauthorizedException("Credenciales incorrectas");
    }
    const contenido = {
      username: usuario.username,
      rol: usuario.rol,
    }
    const jwt = new JwtDto();
    jwt.token = await this.jwtService.signAsync(contenido);
    return jwt;
  }

  findAll() : any[] {
    return [];
  }

  async findOne(username: string) : Promise<GetUsuarioDto> {
    const usuario = await this.usuarioModel.findOne({
      username: username
    });
    const dto = new GetUsuarioDto();
    dto.username = usuario.username;
    dto.rol = usuario.rol;
    dto.estado = usuario.estado;
    return usuario;
  }

  async update(actualizarEstadoUsuarioDto: ActualizarEstadoUsuarioDto): Promise<GetUsuarioDto> {
    await this.usuarioModel.updateOne({
      username: actualizarEstadoUsuarioDto.username
    }, {
      estado: actualizarEstadoUsuarioDto.estado
    });
    return await this.findOne(actualizarEstadoUsuarioDto.username);
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
