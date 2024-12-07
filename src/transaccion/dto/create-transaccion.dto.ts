import { ApiProperty } from "@nestjs/swagger";

export class CreateTransaccionDto {

  @ApiProperty({ example: 1000 , description: 'Monto de la transaccion' })
  monto: number;

  @ApiProperty({ example: 'RETIRO' , description: 'Tipo de transaccion' })
  tipo: string;

  @ApiProperty({ example: '3216844322' , description: 'Numero de cuenta' })
  cuenta: string;

}
