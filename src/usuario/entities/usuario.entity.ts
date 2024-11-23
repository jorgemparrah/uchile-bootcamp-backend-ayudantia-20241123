import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ collection: "usuario" })
export class Usuario {

  @Prop({ name: 'username', required: true, unique: true })
  username: string;

  @Prop({ name: 'password', required: true })
  password: string;

  @Prop({ name: 'rol', required: true })
  rol: string;

  @Prop({ name: 'estado', required: true })
  estado: string;

}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);