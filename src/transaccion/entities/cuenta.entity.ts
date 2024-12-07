import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ collection: "cuenta" })
export class Cuenta {

  @Prop({ name: 'numero', required: true, unique: true })
  numero: string;

  @Prop({ name: 'saldo', required: true })
  saldo: number;

  @Prop({ name: 'tipo', required: true })
  tipo: string;

  @Prop({ name: 'estado', required: true })
  estado: string;

  @Prop({ name: 'rutUsuario', required: true })
  rutUsuario: string;
}

export const CuentaSchema = SchemaFactory.createForClass(Cuenta);