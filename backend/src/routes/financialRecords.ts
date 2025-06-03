// backend/src/routes/financialRecords.ts
import { Router } from 'express';
import prisma from '../db';

const router = Router();

// GET all financial records (optionally filter by type or category)
router.get('/', async (req, res) => {
  const { type, category } = req.query;
  try {
    const records = await prisma.financialRecord.findMany({
      where: {
        type: type ? String(type) : undefined,
        category: category ? String(category) : undefined,
      },
      orderBy: { date: 'desc' }
    });
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching financial records' });
  }
});

// POST a new financial record
router.post('/', async (req, res) => {
  try {
    const { type, description, amount, date, category, reference } = req.body;
    if (!type || !description || !amount || !date) {
      return res.status(400).json({ error: 'Missing required fields: type, description, amount, date' });
    }
    if (type !== "Income" && type !== "Expense") {
      return res.status(400).json({ error: 'Invalid type. Must be "Income" or "Expense".' });
    }


    const newRecord = await prisma.financialRecord.create({
      data: {
        type,
        description,
        amount,
        date: new Date(date),
        category,
        reference,
      },
    });
    res.status(201).json(newRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating financial record' });
  }
});

// GET a single financial record by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const record = await prisma.financialRecord.findUnique({
      where: { id },
    });
    if (record) {
      res.json(record);
    } else {
      res.status(404).json({ error: 'Financial record not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching financial record' });
  }
});

// PUT to update a financial record by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { type, description, amount, date, category, reference } = req.body;

    if (type && type !== "Income" && type !== "Expense") {
      return res.status(400).json({ error: 'Invalid type. Must be "Income" or "Expense".' });
    }

    const updatedRecord = await prisma.financialRecord.update({
      where: { id },
      data: {
        type,
        description,
        amount,
        date: date ? new Date(date) : undefined,
        category,
        reference,
        updatedAt: new Date(),
      },
    });
    res.json(updatedRecord);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Financial record not found for update' });
    }
    res.status(500).json({ error: 'Error updating financial record' });
  }
});

// DELETE a financial record by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.financialRecord.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Financial record not found for deletion' });
    }
    res.status(500).json({ error: 'Error deleting financial record' });
  }
});

export default router;
