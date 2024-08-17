-- Dropping existing tables if they exist
DROP TABLE IF EXISTS administrador;

DROP TABLE IF EXISTS bodeguero;

DROP TABLE IF EXISTS cliente;

DROP TABLE IF EXISTS detalle;

DROP TABLE IF EXISTS factura;

DROP TABLE IF EXISTS ingresosBod;

DROP TABLE IF EXISTS producto;

DROP TABLE IF EXISTS tipo;

DROP TABLE IF EXISTS usuario;

DROP TABLE IF EXISTS vendedor;

-- Table: ADMINISTRADOR
CREATE TABLE administrador
(
   idU                  INT NOT NULL AUTO_INCREMENT,
   numVentasA           INT NOT NULL,
   totalVentasA         FLOAT(6,2) NOT NULL,
   numRegistrosA        INT NOT NULL,
   totalRegistrosA      FLOAT(6,2) NOT NULL,
   PRIMARY KEY (idU)
);

-- Table: BODEGUERO
CREATE TABLE bodeguero
(
   idU                  INT NOT NULL AUTO_INCREMENT,
   numRegistrosB        INT NOT NULL,
   totalRegistrosB      FLOAT(6,2) NOT NULL,
   PRIMARY KEY (idU)
);

-- Table: CLIENTE
CREATE TABLE cliente
(
   idC                  INT NOT NULL AUTO_INCREMENT,
   cedula               VARCHAR(10) NOT NULL,
   nombreC              VARCHAR(50) NOT NULL,
   apellidoC            VARCHAR(50) NOT NULL,
   telefono             VARCHAR(10) NOT NULL,
   email                VARCHAR(50) NOT NULL,
   direccion            VARCHAR(50) NOT NULL,
   PRIMARY KEY (idC, cedula)
);

-- Table: DETALLE
CREATE TABLE detalle
(
   idF                  INT NOT NULL,
   idP                  INT NOT NULL,
   codigoP              VARCHAR(30) NOT NULL,
   cantidadPf           INT NOT NULL,
   precioPf             FLOAT(6,2) NOT NULL,
   ivaPf                DECIMAL(2,2) NOT NULL,
   icePf                DECIMAL(2,2),
   PRIMARY KEY (idF, idP, codigoP)
);

-- Table: FACTURA
CREATE TABLE factura
(
   idF                  INT NOT NULL AUTO_INCREMENT,
   idC                  INT NOT NULL,
   cedula               VARCHAR(10) NOT NULL,
   idU                  INT NOT NULL,
   fechaF               DATETIME NOT NULL,
   PRIMARY KEY (idF)
);

-- Table: INGRESOSBOD
CREATE TABLE ingresosBod
(
   idU                  INT NOT NULL AUTO_INCREMENT,
   idP                  INT NOT NULL,
   codigoP              VARCHAR(30) NOT NULL,
   fechaIngresoBod      DATETIME NOT NULL,
   PRIMARY KEY (idU, idP, codigoP)
);

-- Table: PRODUCTO
CREATE TABLE producto
(
   idP                  INT NOT NULL AUTO_INCREMENT,
   codigoP              VARCHAR(30) NOT NULL,
   idT                  INT NOT NULL,
   nombreP              VARCHAR(30) NOT NULL,
   descripcionP         VARCHAR(250),
   cantidadP            INT NOT NULL,
   precioP              FLOAT(6,2) NOT NULL,
   costoP               FLOAT(6,2) NOT NULL,
   PRIMARY KEY (idP, codigoP)
);

-- Table: TIPO
CREATE TABLE tipo
(
   idT                  INT NOT NULL AUTO_INCREMENT,
   nombreT              VARCHAR(50) NOT NULL,
   PRIMARY KEY (idT)
);

-- Table: USUARIO
CREATE TABLE usuario
(
   idU                  INT NOT NULL AUTO_INCREMENT,
   nombreUsuario        VARCHAR(30) NOT NULL,
   nombreU              VARCHAR(50),
   apellidoU            VARCHAR(50),
   passwordU            VARCHAR(20) NOT NULL,
   rolU                 VARCHAR(20) NOT NULL,
   fechaCreacionU       DATETIME NOT NULL,
   estadoU              BOOL NOT NULL,
   PRIMARY KEY (idU)
);

-- Table: VENDEDOR
CREATE TABLE vendedor
(
   idU                  INT NOT NULL AUTO_INCREMENT,
   numVentasV           INT NOT NULL,
   totalVentasV         FLOAT(6,2) NOT NULL,
   PRIMARY KEY (idU)
);

-- Adding Foreign Key Constraints
ALTER TABLE administrador ADD CONSTRAINT FK_ES FOREIGN KEY (idU)
      REFERENCES usuario (idU) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE bodeguero ADD CONSTRAINT FK_ES2 FOREIGN KEY (idU)
      REFERENCES usuario (idU) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE detalle ADD CONSTRAINT FK_CONTIENE FOREIGN KEY (idF)
      REFERENCES factura (idF) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE detalle ADD CONSTRAINT FK_ENCUENTRA FOREIGN KEY (idP, codigoP)
      REFERENCES producto (idP, codigoP) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE factura ADD CONSTRAINT FK_OBTIENE FOREIGN KEY (idC, cedula)
      REFERENCES cliente (idC, cedula) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE factura ADD CONSTRAINT FK_REALIZA FOREIGN KEY (idU)
      REFERENCES administrador (idU) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE factura ADD CONSTRAINT FK_REALIZA_V FOREIGN KEY (idU)
      REFERENCES vendedor (idU) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE ingresosBod ADD CONSTRAINT FK_INGRESA_B FOREIGN KEY (idP, codigoP)
      REFERENCES producto (idP, codigoP) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE ingresosBod ADD CONSTRAINT FK_INGRESA_B2 FOREIGN KEY (idU)
      REFERENCES bodeguero (idU) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE ingresosBod ADD CONSTRAINT FK_REGISTRA FOREIGN KEY (idU)
      REFERENCES administrador (idU) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE producto ADD CONSTRAINT FK_PERTENECE FOREIGN KEY (idT)
      REFERENCES tipo (idT) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE vendedor ADD CONSTRAINT FK_ES3 FOREIGN KEY (idU)
      REFERENCES usuario (idU) ON DELETE RESTRICT ON UPDATE RESTRICT;
