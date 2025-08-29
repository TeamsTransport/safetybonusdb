import express from 'express';
import db from '../db.js';
const router = express.Router();

router.get('/', async (_req, res) => {
  const [rows] = await db.execute('SELECT * FROM safety_categories ORDER BY category_id DESC');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { code, description, scoring_system, p_i_score } = req.body;
  const [r] = await db.execute(
    `INSERT INTO safety_categories (code, description, scoring_system, p_i_score)
     VALUES (?, ?, ?, ?)`,
    [code, description || null, scoring_system || null, p_i_score || 0]
  );
  res.status(201).json({ id: r.insertId });
});

export default router;
