import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'reporte_saldos' })
export class ReporteSaldos {

  @PrimaryColumn({ name: 'cuenta' })
  cuenta: string;

  @Column({ name: 'rutUsuario' })
  rut: string;

  @Column({ name: 'totalTransacciones' })
  cantidadTransacciones: number;

  @Column({ name: 'saldo' })
  saldo: number;
}