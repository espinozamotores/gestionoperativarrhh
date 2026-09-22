-- Ejecutar esto UNA sola vez desde el editor SQL de Vercel Postgres
-- (Storage > tu base de datos > pestaña "Query")

CREATE TABLE IF NOT EXISTS asistencia (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL,
  hora TEXT NOT NULL,
  retraso INT DEFAULT 0,
  creado TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quejas (
  id SERIAL PRIMARY KEY,
  cliente TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  severidad INT NOT NULL,
  resuelta BOOLEAN DEFAULT FALSE,
  creado TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS opiniones (
  id SERIAL PRIMARY KEY,
  cliente TEXT NOT NULL,
  puntaje INT NOT NULL,
  comentario TEXT,
  creado TIMESTAMP DEFAULT NOW()
);

-- Datos de ejemplo opcionales (podés borrar este bloque si no lo querés)
INSERT INTO asistencia (nombre, tipo, hora, retraso) VALUES
  ('Ana Pérez', 'ENTRADA', '07:52', 0),
  ('Luis Gómez', 'ENTRADA', '08:14', 0),
  ('María Rojas', 'ENTRADA', '09:41', 41);

INSERT INTO quejas (cliente, descripcion, severidad, resuelta) VALUES
  ('Comercial Andina S.A.', 'El pedido llegó 5 días después de la fecha comprometida.', 5, false),
  ('Distribuidora Lima Norte', 'Producto entregado con el embalaje roto.', 4, false),
  ('Tiendas El Roble', 'El asesor asignado no envió la cotización prometida.', 3, false);

INSERT INTO opiniones (cliente, puntaje, comentario) VALUES
  ('Comercial Andina S.A.', 3, 'La calidad es buena pero los plazos deben mejorar.'),
  ('Hotel Costa Verde', 5, 'Excelente acompañamiento del asesor comercial.'),
  ('Clínica San Rafael', 2, 'Difícil contactar con soporte.');
