import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { GetUsuarioDto } from './dto/get-usuario.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { HashPipe } from './pipe/hash.pipe';
import { UsuarioExistePipe } from './pipe/usuario-existe.pipe';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { JwtDto } from './dto/jwt.dto';
import { UsuarioNoExistePipe } from './pipe/usuario-no-existe.pipe';
import { ActualizarEstadoUsuarioDto } from './dto/actualizar-estado-usuario.dto';
import { JwtGuard } from 'src/seguridad/guard/jwt.guard';
import { Rol } from './enum/rol.enum';
import { RolesAutorizados } from 'src/seguridad/decorator/rol.decorator';
import { ValidarRolGuard } from 'src/seguridad/guard/validar-rol.guard';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @UsePipes(UsuarioExistePipe, HashPipe)
  @ApiBody({ type: CreateUsuarioDto })
  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) : Promise<GetUsuarioDto> {
    return await this.usuarioService.create(createUsuarioDto);
  }

  @UsePipes(UsuarioNoExistePipe, HashPipe)
  @ApiBody({ type: LoginUsuarioDto })
  @Post("login")
  async login(@Body() loginUsuarioDto: LoginUsuarioDto) : Promise<JwtDto> {
    return await this.usuarioService.login(loginUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, ValidarRolGuard)
  @RolesAutorizados(Rol.ADMIN)
  @Patch("estado")
  async update(@Body() actualizarEstadoUsuarioDto: ActualizarEstadoUsuarioDto): Promise<GetUsuarioDto> {
    return await this.usuarioService.update(actualizarEstadoUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}
