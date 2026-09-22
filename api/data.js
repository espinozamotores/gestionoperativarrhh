import { sql } from '@vercel/postgres';

const TABLAS = ['asistencia', 'quejas', 'opiniones'];

export default async function handler(req, res) {
  const { table } = req.query;

  if (!TABLAS.includes(table)) {
    return res.status(400).json({ error: 'Tabla inválida' });
  }

  try {
    if (req.method === 'GET') {
      const result = await sql.query(`SELECT * FROM ${table} ORDER BY id DESC`);
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const body = req.body;
      let result;

      if (table === 'asistencia') {
        const { nombre, tipo, hora, retraso } = body;
        result = await sql`
          INSERT INTO asistencia (nombre, tipo, hora, retraso)
          VALUES (${nombre}, ${tipo}, ${hora}, ${retraso || 0})
          RETURNING *`;
      } else if (table === 'quejas') {
        const { cliente, descripcion, severidad } = body;
        result = await sql`
          INSERT INTO quejas (cliente, descripcion, severidad)
          VALUES (${cliente}, ${descripcion}, ${severidad})
          RETURNING *`;
      } else if (table === 'opiniones') {
        const { cliente, puntaje, comentario } = body;
        result = await sql`
          INSERT INTO opiniones (cliente, puntaje, comentario)
          VALUES (${cliente}, ${puntaje}, ${comentario || 'Sin comentario'})
          RETURNING *`;
      }
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'PATCH' && table === 'quejas') {
      const { id, resuelta } = req.body;
      const result = await sql`
        UPDATE quejas SET resuelta = ${resuelta} WHERE id = ${id} RETURNING *`;
      return res.status(200).json(result.rows[0]);
    }

    if (req.method === 'DELETE') {
      await sql.query(`DELETE FROM ${table}`);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
