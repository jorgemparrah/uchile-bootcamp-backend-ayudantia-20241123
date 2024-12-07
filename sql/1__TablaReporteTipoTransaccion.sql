-- { cuenta: '2821064655', depositos: 287, retiros: 270 }

CREATE TABLE reporte_tipo_transaccion (
    cuenta VARCHAR(12),
    depositos INTEGER,
    retiros INTEGER,
    PRIMARY KEY (cuenta)
);