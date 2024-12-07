-- {
--   rutUsuario: '11.111.555-5',
--   totalTransacciones: 582,
--   cuenta: '4251588947',
--   saldo: -14543272
-- }

CREATE TABLE reporte_saldos (
    rutUsuario VARCHAR(13),
    cuenta VARCHAR(12),
    totalTransacciones INTEGER,
    saldo INTEGER,
    PRIMARY KEY (cuenta)
);