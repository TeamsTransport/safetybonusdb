import express from 'express';
import db from '../db.js';
const router = express.Router();

router.get('/', async (_req, res) => {
  const [rows] = await db.execute(`
    SELECT e.*, d.first_name, d.last_name, d.driver_code,
           c.code AS category_code, c.description AS category_name
    FROM safety_events e
    JOIN drivers d ON d.driver_id = e.driver_id
    JOIN safety_categories c ON c.category_id = e.category_id
    ORDER BY e.event_id DESC
  `);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { driver_id, event_date, category_id, notes, bonus_score, p_i_score, bonus_period } = req.body;
  try {
    const [r] = await db.execute(
      `INSERT INTO safety_events (driver_id, event_date, category_id, notes, bonus_score, p_i_score, bonus_period)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [driver_id, event_date, category_id, notes || '', bonus_score || 0, p_i_score || 0, !!bonus_period]
    );
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/:id', async (req, res) => {
  const { driver_id, event_date, category_id, notes, bonus_score, p_i_score, bonus_period } = req.body;
  await db.execute(
    `UPDATE safety_events SET driver_id=?, event_date=?, category_id=?, notes=?, bonus_score=?, p_i_score=?, bonus_period=?
     WHERE event_id=?`,
    [driver_id, event_date, category_id, notes || '', bonus_score || 0, p_i_score || 0, !!bonus_period, req.params.id]
  );
  res.json({ ok: true });
});

router.delete('/:id', async (req, res) => {
  await db.execute('DELETE FROM safety_events WHERE event_id=?', [req.params.id]);
  res.json({ ok: true });
});

export default router;
