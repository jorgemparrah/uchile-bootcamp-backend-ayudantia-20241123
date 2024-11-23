import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Estado } from "../enum/estado.enum";

export class ActualizarEstadoUsuarioDto {

  @ApiProperty({ example: '12.345.678-9', description: 'Rut de usuario' })
  readonly username: string;

  @ApiProperty({ example: 'ACTIVO', description: 'Nuevo estado del usuario', enumName: 'Estado' })
  @IsEnum(Estado, { message: 'Opción inválida' })
  readonly estado: string;

}
