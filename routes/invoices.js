const express = require('express');
const router = express.Router();
const db = require('../db');
const slugify = require('slugify');

// Middleware to parse JSON
router.use(express.json());

// GET /invoices
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, comp_code FROM invoices');
    return res.json({ invoices: result.rows });
  } catch (err) {
    return next(err);
  }
});

// GET /invoices/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    return res.json({ invoice: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// POST /invoices
router.post('/', async (req, res, next) => {
  try {
    const { comp_code, amt } = req.body;
    if (!comp_code || !amt) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const result = await db.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *', [comp_code, amt]);
    return res.status(201).json({ invoice: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// PUT /invoices/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amt, paid } = req.body;
    let paid_date = null;
    if (paid) {
      paid_date = new Date().toISOString().slice(0, 10);
    }
    const result = await db.query('UPDATE invoices SET amt = $1, paid = $2, paid_date = $3 WHERE id = $4 RETURNING *', [amt, paid, paid_date, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    return res.json({ invoice: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// DELETE /invoices/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM invoices WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    return res.json({ status: 'deleted' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;