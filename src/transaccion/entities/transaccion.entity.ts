import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ collection: "transaccion" })
export class Transaccion {

  @Prop({ name: 'monto', required: true })
  monto: number;

  @Prop({ name: 'fecha', required: true })
  fecha: Date;

  @Prop({ name: 'tipo', required: true })
  tipo: string;

  @Prop({ name: 'cuenta', required: true })
  cuenta: string;

}

export const TransaccionSchema = SchemaFactory.createForClass(Transaccion);