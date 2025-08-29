import express from 'express';
import db from '../db.js';
const router = express.Router();

router.get('/', async (_req, res) => {
  const [rows] = await db.execute('SELECT * FROM trucks ORDER BY truck_id DESC');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { unit_number, status } = req.body;
  const [r] = await db.execute(
    'INSERT INTO trucks (unit_number, status) VALUES (?, ?)',
    [unit_number, status || 'active']
  );
  res.status(201).json({ id: r.insertId });
});

router.put('/:id', async (req, res) => {
  const { unit_number, status } = req.body;
  await db.execute('UPDATE trucks SET unit_number=?, status=? WHERE truck_id=?',
    [unit_number, status, req.params.id]);
  res.json({ ok: true });
});

router.delete('/:id', async (req, res) => {
  await db.execute('DELETE FROM trucks WHERE truck_id=?', [req.params.id]);
  res.json({ ok: true });
});

export default router;
