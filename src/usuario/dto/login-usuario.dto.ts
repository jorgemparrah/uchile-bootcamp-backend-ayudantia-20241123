import { ApiProperty } from "@nestjs/swagger";

export class LoginUsuarioDto {

  @ApiProperty({ example: '12.345.678-9', description: 'Rut de usuario' })
  readonly username: string;

  @ApiProperty({ example: '123456789', description: 'Clave de usuario' })
  readonly password: string;

}
