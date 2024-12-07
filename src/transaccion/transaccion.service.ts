import { Injectable } from '@nestjs/common';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { UpdateTransaccionDto } from './dto/update-transaccion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaccion } from './entities/transaccion.entity';
import { Model } from 'mongoose';
import { Cuenta } from './entities/cuenta.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import * as dayjs from 'dayjs'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReporteTipoTransaccion } from 'src/orm/entity/reporte-tipo-transaccion.entity';
import { ReporteSaldos } from 'src/orm/entity/reporte-saldos.entity';

@Injectable()
export class TransaccionService {

  agregate1 = [{
    $group:
      {
        _id: ["$tipo", "$cuenta"],
        cantidadTransacciones: {
          $count: {}
        }
      }
  },
  {
    $project:
      {
        _id: 0,
        cuenta: {
          $arrayElemAt: ["$_id", 1]
        },
        tipo: {
          $arrayElemAt: ["$_id", 0]
        },
        cantidadTransacciones: 1
      }
  }];
  
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
    @InjectModel(Cuenta.name) private readonly cuentaModel: Model<Cuenta>,
    @InjectModel(Transaccion.name) private readonly transaccionModel: Model<Transaccion>,
    @InjectRepository(ReporteTipoTransaccion) private readonly reporteTipoTransaccionRepository: Repository<ReporteTipoTransaccion>,
    @InjectRepository(ReporteSaldos) private readonly reporteSaldosRepository: Repository<ReporteSaldos>
  ) {}

  async cargarDatos() {
    const existenCuentas = await this.cuentaModel.exists({});
    if (!existenCuentas) {
      const usuarios = await this.usuarioModel.find({ rol: 'USER' });
      for (const usuario of usuarios) {
        const cantidadCuentas = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < cantidadCuentas; i++) {
          const cuenta = new Cuenta();
          cuenta.numero = Math.floor(Math.random() * 10000000000).toString();
          cuenta.saldo = 0;
          cuenta.tipo = Math.random() > 0.5 ? 'CUENTA_CORRIENTE' : 'CUENTA_VISTA';
          cuenta.estado = 'ACTIVA';
          cuenta.rutUsuario = usuario.username;
          await this.cuentaModel.create(cuenta);
        }
      }
      const fechaDesde = 1698796800;
      const fechaHasta = 1733011200;
      const rango = fechaHasta - fechaDesde;
      const cuentas = await this.cuentaModel.find({});
      for (const cuenta of cuentas) {
        const cantidadTransacciones = Math.floor(Math.random() * 100) + 500;
        for (let i = 0; i < cantidadTransacciones; i++) {
          const transaccion = new Transaccion();
          transaccion.monto = Math.floor(Math.random() * 1000000);
          transaccion.tipo = Math.random() > 0.5 ? 'DEPOSITO' : 'RETIRO';
          transaccion.cuenta = cuenta.numero;
          transaccion.fecha = dayjs.unix(Math.floor(Math.random() * rango) + fechaDesde).toDate();
          this.transaccionModel.create(transaccion);
        }
      }
    }
  }

  async create(createTransaccionDto: CreateTransaccionDto) {
    const transaccion = new Transaccion();
    transaccion.monto = createTransaccionDto.monto;
    transaccion.tipo = createTransaccionDto.tipo;
    transaccion.cuenta = createTransaccionDto.cuenta;
    transaccion.fecha = dayjs().toDate();
    await this.transaccionModel.create(transaccion);

    const resultado = await this.transaccionModel.aggregate([
      {
        $match:
          {
            cuenta: createTransaccionDto.cuenta
          }
      },
      ...this.agregate1
    ]).exec();
    const cuentas = this.transformarDatos(resultado);
    await this.actualizarReporteCantidadTipoTransacciones(cuentas[0]);

    const resultado2 = await this.cuentaModel.aggregate([
      {
        $match:
          {
            numero: createTransaccionDto.cuenta
          }
      },
      {
        $project:
          {
            _id: 0,
            estado: 0,
            tipo: 0
          }
      },
      {
        $lookup:
          {
            from: "transaccion",
            localField: "numero",
            foreignField: "cuenta",
            as: "transacciones"
          }
      },
      {
        $addFields:
          {
            totalTransacciones: {
              $size: "$transacciones"
            }
          }
      },
      {
        $unwind:
          {
            path: "$transacciones"
          }
      },
      {
        $project:
          {
            numero: 1,
            saldo: 1,
            rutUsuario: 1,
            totalTransacciones: 1,
            monto: {
              $cond: {
                if: {
                  $eq: [
                    "$transacciones.tipo",
                    "RETIRO"
                  ]
                },
                then: {
                  $multiply: [
                    "$transacciones.monto",
                    -1
                  ]
                },
                else: "$transacciones.monto"
              }
            }
          }
      },
      {
        $group:
          {
            _id: "$numero",
            rutUsuario: {
              $first: "$rutUsuario"
            },
            saldo: {
              $min: "$saldo"
            },
            saldoFinal: {
              $sum: "$monto"
            },
            totalTransacciones: {
              $max: "$totalTransacciones"
            }
          }
      },
      {
        $project:
          {
            _id: 0,
            rutUsuario: 1,
            cuenta: "$_id",
            saldo: {
              $add: ["$saldo", "$saldoFinal"]
            },
            totalTransacciones: 1
          }
      }
    ]).exec();
    await this.actualizarReporteSaldos(resultado2[0]);
  }

  async cargaReportes() {
    const datosCargados1 = await this.reporteTipoTransaccionRepository.exists({});
    if (!datosCargados1) {
      await this.reporteCantidadTipoTransacciones();
    }
    const datosCargados2 = await this.reporteSaldosRepository.exists({});
    if (!datosCargados2) {
      await this.reporteSaldosCuentas();
    }
  }

  async reporteCantidadTipoTransacciones() {
    const resultado = await this.transaccionModel.aggregate(this.agregate1).exec();

    // SE PUEDE HACER CON reduce
    const cuentas = this.transformarDatos(resultado)
    for (const resumen of cuentas) {
      await this.actualizarReporteCantidadTipoTransacciones(resumen);
    }
  }

  async reporteSaldosCuentas() {
    const resultado = await this.cuentaModel.aggregate([
      {
        $project:
          {
            _id: 0,
            estado: 0,
            tipo: 0
          }
      },
      {
        $lookup:
          {
            from: "transaccion",
            localField: "numero",
            foreignField: "cuenta",
            as: "transacciones"
          }
      },
      {
        $addFields:
          {
            totalTransacciones: {
              $size: "$transacciones"
            }
          }
      },
      {
        $unwind:
          {
            path: "$transacciones"
          }
      },
      {
        $project:
          {
            numero: 1,
            saldo: 1,
            rutUsuario: 1,
            totalTransacciones: 1,
            monto: {
              $cond: {
                if: {
                  $eq: [
                    "$transacciones.tipo",
                    "RETIRO"
                  ]
                },
                then: {
                  $multiply: [
                    "$transacciones.monto",
                    -1
                  ]
                },
                else: "$transacciones.monto"
              }
            }
          }
      },
      {
        $group:
          {
            _id: "$numero",
            rutUsuario: {
              $first: "$rutUsuario"
            },
            saldo: {
              $min: "$saldo"
            },
            saldoFinal: {
              $sum: "$monto"
            },
            totalTransacciones: {
              $max: "$totalTransacciones"
            }
          }
      },
      {
        $project:
          {
            _id: 0,
            rutUsuario: 1,
            cuenta: "$_id",
            saldo: {
              $add: ["$saldo", "$saldoFinal"]
            },
            totalTransacciones: 1
          }
      }
    ]).exec();
    for(const resumen of resultado) {
      await this.actualizarReporteSaldos(resumen);
    }
  }

  private transformarDatos(resultado) {
    const cuentas = [];
    for (const res of resultado) {
      let resumen = cuentas.find(r => r.cuenta === res.cuenta);
      if (!resumen) {
        resumen = {
          cuenta: res.cuenta,
          depositos: 0,
          retiros: 0
        }
        cuentas.push(resumen);
      }
      if (res.tipo === 'DEPOSITO') {
        resumen.depositos = res.cantidadTransacciones;
      } else {
        resumen.retiros = res.cantidadTransacciones;
      }
    }
    console.log(cuentas);
    return cuentas;
  }

  private async actualizarReporteCantidadTipoTransacciones(resumen) {
    const reporte = new ReporteTipoTransaccion();
    reporte.cuenta = resumen.cuenta;
    reporte.depositos = resumen.depositos;
    reporte.retiros = resumen.retiros;
    await this.reporteTipoTransaccionRepository.save(reporte);
  }

  private async actualizarReporteSaldos(resumen) {
    const reporte = new ReporteSaldos();
    reporte.cuenta = resumen.cuenta;
    reporte.rut = resumen.rutUsuario;
    reporte.cantidadTransacciones = resumen.totalTransacciones;
    reporte.saldo = resumen.saldo;
    await this.reporteSaldosRepository.save(reporte);
  }

}
