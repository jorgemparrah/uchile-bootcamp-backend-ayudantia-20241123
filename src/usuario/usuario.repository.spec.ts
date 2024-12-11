import { UsuarioRepository } from './usuario.repository';
import { Usuario } from './entities/usuario.entity';
import { Estado } from './enum/estado.enum';

describe('UsuarioRepository', () => {
  let usuarioRepository: UsuarioRepository;

  beforeEach(() => {
    usuarioRepository = new UsuarioRepository();
  });

  it('should be defined', () => {
    expect(usuarioRepository).toBeDefined();
  });

  it('should initialize with two users', () => {
    expect(usuarioRepository.usuarios.length).toBe(2);
  });

  it('should find a user by username', () => {
    const input = { username: 'admin' };
    const usuario = usuarioRepository.findOne(input);
    expect(usuario).toBeDefined();
    expect(usuario.username).toBe('admin');
    expect(usuario.password).toBe('admin');
    expect(usuario.rol).toBe('ADMIN');
    expect(usuario.estado).toBe(Estado.ACTIVO);
  });

  it('should return undefined for a non-existing user', () => {
    const input = { username: 'nonexistent' };
    const usuario = usuarioRepository.findOne(input);
    expect(usuario).toBeUndefined();
  });
});