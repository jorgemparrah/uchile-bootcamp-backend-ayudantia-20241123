import { ApiProperty } from "@nestjs/swagger";

export class GetUsuarioDto {

  @ApiProperty({ example: '12.345.678-9', description: 'Rut de usuario' })
  username: string;

  @ApiProperty({ example: 'USER', description: 'Rol del usuario' })
  rol: string;

  @ApiProperty({ example: 'ACTIVO', description: 'Estado del usuario' })
  estado: string;

}
