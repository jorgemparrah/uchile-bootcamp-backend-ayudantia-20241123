import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { RolesAutorizados } from '../seguridad/decorator/rol.decorator';
import { JwtGuard } from '../seguridad/guard/jwt.guard';
import { ValidarRolGuard } from '../seguridad/guard/validar-rol.guard';
import { ActualizarEstadoUsuarioDto } from './dto/actualizar-estado-usuario.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { GetUsuarioDto } from './dto/get-usuario.dto';
import { JwtDto } from './dto/jwt.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { Rol } from './enum/rol.enum';
import { HashPipe } from './pipe/hash.pipe';
import { UsuarioExistePipe } from './pipe/usuario-existe.pipe';
import { UsuarioNoExistePipe } from './pipe/usuario-no-existe.pipe';
import { UsuarioService } from './usuario.service';

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
    const result = await this.usuarioService.login(loginUsuarioDto);
    return result;
  }

  @Get()
  findAll() : any[] {
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
