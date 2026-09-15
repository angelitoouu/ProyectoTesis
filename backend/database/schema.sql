-- Esquema de base de datos: Sistema de gestión para taller de costura
-- Ejecutar con: psql -U tu_usuario -d nombre_bd -f schema.sql

DO $$ BEGIN
  CREATE TYPE estado_encargo AS ENUM (
    'pendiente',
    'en_proceso',
    'listo_prueba',
    'listo_retiro',
    'entregado'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  telefono VARCHAR(20) NOT NULL UNIQUE,
  direccion VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS encargos (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  codigo_ticket VARCHAR(10) UNIQUE NOT NULL,
  prenda VARCHAR(150) NOT NULL,
  descripcion_trabajo TEXT,
  medidas JSONB,               -- ej: {"cintura": 80, "largo": 100, "tiro": 30}
  fecha_recepcion DATE DEFAULT CURRENT_DATE,
  fecha_entrega_estimada DATE NOT NULL,
  precio_total NUMERIC(10,2) NOT NULL,
  abono NUMERIC(10,2) DEFAULT 0,
  estado estado_encargo DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_encargos_cliente ON encargos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_encargos_codigo ON encargos(codigo_ticket);

-- Datos de ejemplo para probar el avance
INSERT INTO clientes (nombre, telefono, direccion) VALUES
  ('María Pérez', '+56911111111', 'Calle Falsa 123, Penco'),
  ('Juan Soto', '+56922222222', 'Villa Cosmito, Penco')
ON CONFLICT (telefono) DO NOTHING;

INSERT INTO encargos (cliente_id, codigo_ticket, prenda, descripcion_trabajo, medidas, fecha_entrega_estimada, precio_total, abono, estado)
VALUES
  (1, 'TK-0001', 'Vestido de fiesta', 'Entalle en la cintura y cambio de largo', '{"cintura": 78, "largo": 110}', CURRENT_DATE + INTERVAL '5 days', 25000, 12500, 'en_proceso'),
  (2, 'TK-0002', 'Pantalón de vestir', 'Basta y ajuste de cintura', '{"cintura": 90, "basta": 100}', CURRENT_DATE + INTERVAL '2 days', 8000, 4000, 'pendiente')
ON CONFLICT (codigo_ticket) DO NOTHING;
