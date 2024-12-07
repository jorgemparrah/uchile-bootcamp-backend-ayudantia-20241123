import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'reporte_tipo_transaccion' })
export class ReporteTipoTransaccion {
  @PrimaryColumn({ name: 'cuenta' })
  cuenta: string;

  @Column({ name: 'depositos' })
  depositos: number;

  @Column({ name: 'retiros' })
  retiros: number;
}