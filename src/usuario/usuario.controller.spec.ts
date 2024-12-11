import { UnauthorizedException } from "@nestjs/common";
import { JwtDto } from "./dto/jwt.dto";
import { LoginUsuarioDto } from "./dto/login-usuario.dto";
import { UsuarioController } from "./usuario.controller";
import { UsuarioService } from "./usuario.service";

describe('UsuarioController', () => {

  let usuarioController: UsuarioController;
  let usuarioService: UsuarioService;

  beforeEach(async () => {
    usuarioService = new UsuarioService(null, null, null);
    usuarioController = new UsuarioController(usuarioService);
  })

  // FUNCIONALIDAD
  describe('login', () => {

    // UN CASO DE PRUEBA
    it('Login correcto', async () => {
      jest.spyOn(usuarioService, 'login')
        .mockImplementation(async (input) => {
          const dto = new JwtDto();
          dto.token = "TOKEN JWT GENERADO";
          return dto;
        });

      const credenciales = new LoginUsuarioDto();
      credenciales.username = 'admin';
      credenciales.password = 'admin';

      // EJECUCION
      const result = await  usuarioController.login(credenciales);
      // FIN DE EJECUCION

      // ASSERT
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(JwtDto);
      expect(result.token).toBe("TOKEN JWT GENERADO");
    });

    // UN CASO DE PRUEBA
    it('Login con excepcion', async () => {
      jest.spyOn(usuarioService, 'login')
        .mockImplementation(async (input) => {
          throw new UnauthorizedException('Mensaje de error');
        });

      const credenciales = new LoginUsuarioDto();
      credenciales.username = 'admin';
      credenciales.password = 'admin';

      // expect(async () => await usuarioController.login(credenciales)).toThrow(UnauthorizedException);

      try {
        await usuarioController.login(credenciales);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Mensaje de error');
      }

    });

  })

    // FUNCIONALIDAD
    describe('findAll', () => {

      // UN CASO DE PRUEBA
      it('Trae datos', () => {
        jest.spyOn(usuarioService, 'findAll')
          .mockImplementation(() => [ 'usuario1', 'usuario2' ]);
  
        // EJECUCION
        const result = usuarioController.findAll();
        // FIN DE EJECUCION
  
        // ASSERT
        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(2);
        expect(result[0]).toBe('usuario1');
        expect(result[1]).toBe('usuario2');
      });
  
      // UN CASO DE PRUEBA
      it('Trae una lista vacia', async () => {
        jest.spyOn(usuarioService, 'findAll')
        .mockImplementation(() => []);

        // EJECUCION
        const result = usuarioController.findAll();
        // FIN DE EJECUCION

        // ASSERT
        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(0);

      });
  
    })

 });
 
