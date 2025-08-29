import express from 'express';
import db from '../db.js';
const router = express.Router();

router.get('/', async (_req, res) => {
  const [rows] = await db.execute(`
    SELECT d.*, t.unit_number
    FROM drivers d
    LEFT JOIN trucks t ON d.truck_id = t.truck_id
    ORDER BY d.driver_id DESC
  `);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { driver_code, first_name, last_name, start_date, driver_type, status } = req.body;
  try {
    const [r] = await db.execute(
      `INSERT INTO drivers (driver_code, first_name, last_name, start_date, driver_type, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [driver_code, first_name, last_name, start_date || null, driver_type || 'Company Drivers', status || 'active']
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/:id', async (req, res) => {
  const { driver_code, first_name, last_name, start_date, driver_type, status } = req.body;
  await db.execute(
    `UPDATE drivers SET driver_code=?, first_name=?, last_name=?, start_date=?, driver_type=?, status=? WHERE driver_id=?`,
    [driver_code, first_name, last_name, start_date || null, driver_type, status, req.params.id]
  );
  res.json({ ok: true });
});

router.delete('/:id', async (req, res) => {
  await db.execute('DELETE FROM drivers WHERE driver_id=?', [req.params.id]);
  res.json({ ok: true });
});

export default router;
