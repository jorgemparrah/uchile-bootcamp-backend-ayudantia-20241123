import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Rol } from "../enum/rol.enum";

export class CreateUsuarioDto {

  @ApiProperty({ example: '12.345.678-9', description: 'Rut de usuario' })
  readonly username: string;

  @ApiProperty({ example: '123456789', description: 'Clave de usuario' })
  readonly password: string;

  @ApiProperty({ example: 'USER', description: 'Rol del usuario', enumName: 'Rol' })
  @IsEnum(Rol, { message: 'Opción inválida' })
  readonly rol: string;

}
