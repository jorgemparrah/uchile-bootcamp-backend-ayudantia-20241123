import { UnauthorizedException } from "@nestjs/common";
import { JwtDto } from "./dto/jwt.dto";
import { LoginUsuarioDto } from "./dto/login-usuario.dto";
import { UsuarioController } from "./usuario.controller";
import { UsuarioService } from "./usuario.service";
import { Usuario } from "./entities/usuario.entity";
import { JwtService } from "@nestjs/jwt";
import { Model, ObjectId, ProjectionType, QueryOptions, RootFilterQuery } from "mongoose";
import { UsuarioRepository } from './usuario.repository';

class JwtServiceMock {
  sign = jest.fn();
  signAsync = jest.fn().mockReturnValue("TOKEN JWT GENERADO");
  verify = jest.fn();
  verifyAsync = jest.fn();
  decode = jest.fn();
}


describe('UsuarioService', () => {

  let usuarioService: UsuarioService;
  let modelUsuario: Model<Usuario>;
  let jwtService: JwtService;
  let usuarioRepository: UsuarioRepository;

  beforeEach(async () => {
    usuarioRepository = new UsuarioRepository();
    modelUsuario = {} as Model<Usuario>;
    jwtService = new JwtService();
    usuarioService = new UsuarioService(null, jwtService, usuarioRepository);
  })

  // FUNCIONALIDAD
  describe('login', () => {

    // UN CASO DE PRUEBA
    it('Login correcto', async () => {
      jest.spyOn(usuarioRepository, 'findOne')
        .mockImplementation((input) => {
          let usuarioMock : Usuario = new Usuario();
          usuarioMock.username = 'admin';
          usuarioMock.password = 'admin';
          usuarioMock.rol = 'ADMIN';
          usuarioMock.estado = 'ACTIVO';
          return usuarioMock;
        });

      jest.spyOn(jwtService, 'signAsync')
        .mockImplementation(async () => {
          return "TOKEN JWT GENERADO";
        });

      const credenciales = new LoginUsuarioDto();
      credenciales.username = 'admin';
      credenciales.password = 'admin';

      // EJECUCION
      const result = await  usuarioService.login(credenciales);
      // FIN DE EJECUCION

      // ASSERT
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(JwtDto);
      expect(result.token).toBe("TOKEN JWT GENERADO");
    });
  });

  it('Usuario inactivo', async () => {
    jest.spyOn(usuarioRepository, 'findOne')
      .mockImplementation((input) => {
        let usuarioMock : Usuario = new Usuario();
        usuarioMock.username = 'admin';
        usuarioMock.password = 'admin';
        usuarioMock.rol = 'ADMIN';
        usuarioMock.estado = 'INACTIVO';
        return usuarioMock;
      });

    jest.spyOn(jwtService, 'signAsync')
      .mockImplementation(async () => {
        return "TOKEN JWT GENERADO";
      });

    const credenciales = new LoginUsuarioDto();
    credenciales.username = 'admin';
    credenciales.password = 'admin';

    try {
      // EJECUCION
      await usuarioService.login(credenciales);
      // FIN DE EJECUCION
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Credenciales incorrectas');
    }
  });

  it('Clave incorrecta', async () => {
    jest.spyOn(usuarioRepository, 'findOne')
      .mockImplementation((input) => {
        let usuarioMock : Usuario = new Usuario();
        usuarioMock.username = 'admin';
        usuarioMock.password = 'admin8';
        usuarioMock.rol = 'ADMIN';
        usuarioMock.estado = 'ACTIVO';
        return usuarioMock;
      });

    jest.spyOn(jwtService, 'signAsync')
      .mockImplementation(async () => {
        return "TOKEN JWT GENERADO";
      });

    const credenciales = new LoginUsuarioDto();
    credenciales.username = 'admin';
    credenciales.password = 'admin';

    try {
      // EJECUCION
      await usuarioService.login(credenciales);
      // FIN DE EJECUCION
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Credenciales incorrectas');
    }
  });



});

