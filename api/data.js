import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);
const TABLAS = ['asistencia', 'quejas', 'opiniones'];

export default async function handler(req, res) {
  const { table } = req.query;

  if (!TABLAS.includes(table)) {
    return res.status(400).json({ error: 'Tabla inválida' });
  }

  try {
    if (req.method === 'GET') {
      const rows = await sql(`SELECT * FROM ${table} ORDER BY id DESC`);
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const body = req.body;
      let rows;

      if (table === 'asistencia') {
        const { nombre, tipo, hora, retraso } = body;
        rows = await sql(
          `INSERT INTO asistencia (nombre, tipo, hora, retraso) VALUES ($1, $2, $3, $4) RETURNING *`,
          [nombre, tipo, hora, retraso || 0]
        );
      } else if (table === 'quejas') {
        const { cliente, descripcion, severidad } = body;
        rows = await sql(
          `INSERT INTO quejas (cliente, descripcion, severidad) VALUES ($1, $2, $3) RETURNING *`,
          [cliente, descripcion, severidad]
        );
      } else if (table === 'opiniones') {
        const { cliente, puntaje, comentario } = body;
        rows = await sql(
          `INSERT INTO opiniones (cliente, puntaje, comentario) VALUES ($1, $2, $3) RETURNING *`,
          [cliente, puntaje, comentario || 'Sin comentario']
        );
      }
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'PATCH' && table === 'quejas') {
      const { id, resuelta } = req.body;
      const rows = await sql(
        `UPDATE quejas SET resuelta = $1 WHERE id = $2 RETURNING *`,
        [resuelta, id]
      );
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      await sql(`DELETE FROM ${table}`);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
