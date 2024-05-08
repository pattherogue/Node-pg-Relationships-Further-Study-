const express = require('express');
const slugify = require('slugify');
const router = express.Router();
const db = require('../db');

// Middleware to parse JSON
router.use(express.json());

// GET /companies
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT code, name FROM companies');
    return res.json({ companies: result.rows });
  } catch (err) {
    return next(err);
  }
});

// GET /companies/:code
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const result = await db.query('SELECT * FROM companies WHERE code = $1', [code]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    return res.json({ company: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// POST /companies
router.post('/', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const code = slugify(name, { lower: true, strict: true });
    const result = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *', [code, name, description]);
    return res.status(201).json({ company: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// PUT /companies/:code
router.put('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const result = await db.query('UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING *', [name, description, code]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    return res.json({ company: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// DELETE /companies/:code
router.delete('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const result = await db.query('DELETE FROM companies WHERE code = $1', [code]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    return res.json({ status: 'deleted' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
