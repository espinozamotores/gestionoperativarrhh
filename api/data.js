import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL);
const TABLAS = ['asistencia', 'quejas', 'opiniones', 'canjes', 'animos'];

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
        const { nombre, cargo, tipo, hora, retraso } = body;
        rows = await sql(
          `INSERT INTO asistencia (nombre, cargo, tipo, hora, retraso) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [nombre, cargo || 'Sin área', tipo, hora, retraso || 0]
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
      } else if (table === 'canjes') {
        const { nombre, beneficio, costo } = body;
        rows = await sql(
          `INSERT INTO canjes (nombre, beneficio, costo) VALUES ($1, $2, $3) RETURNING *`,
          [nombre, beneficio, costo]
        );
      } else if (table === 'animos') {
        const { cargo, mood } = body;
        rows = await sql(
          `INSERT INTO animos (cargo, mood) VALUES ($1, $2) RETURNING *`,
          [cargo || 'Sin área', mood]
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
