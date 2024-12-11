import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { JwtGuard } from "../seguridad/guard/jwt.guard";
import { JwtDto } from "./dto/jwt.dto";
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { UsuarioController } from "./usuario.controller";
import { UsuarioService } from "./usuario.service";

class UsuarioServiceMock extends UsuarioService {

  constructor() {
    super(null, null, null)
  }


  async login(input: LoginUsuarioDto): Promise<JwtDto> {
    const dto = new JwtDto();
    dto.token = "TOKEN JWT GENERADO";
    return dto;
  }

}

class GenericMock {
}

describe('UsuarioController', () => {
  const dtoMock = new JwtDto();
  dtoMock.token = "TOKEN JWT GENERADO";

  let usuarioController: UsuarioController;
  let usuarioService: UsuarioService;

  beforeEach(async () => {
    console.log('Esto se ejecuta antes de cada prueba');
    const app : TestingModule = await Test.createTestingModule({
      controllers: [ UsuarioController ],
      providers: [
        {
          provide: JwtGuard,
          useClass: GenericMock
        },
        {
          provide: JwtService,
          useClass: GenericMock
        },
        {
          provide: UsuarioService,
          useClass: UsuarioServiceMock
        },
        // {
        //   provide: UsuarioService,
        //   useValue: {
        //     login: jest.fn().mockReturnValue(dtoMock)
        //   }
        // }
      ],
    }).compile();
    usuarioController = app.get<UsuarioController>(UsuarioController);
    usuarioService = app.get<UsuarioService>(UsuarioService);
  })

  // FUNCIONALIDAD
  describe('Prueba de login', () => {

    // UN CASO DE PRUEBA
    it('Login correcto', async () => {
      const credenciales = new LoginUsuarioDto();
      credenciales.username = 'admin';
      credenciales.password = 'admin';

      // EJECUCION
      const result = await  usuarioController.login(credenciales);
      // FIN DE EJECUCION

      // ASSERT
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(JwtDto);
      expect(result.token).toBe("Bearer TOKEN JWT GENERADO");
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

 });
 