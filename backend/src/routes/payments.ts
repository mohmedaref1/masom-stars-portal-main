// backend/src/routes/payments.ts
import { Router } from 'express';
import prisma from '../db';

const router = Router();

// GET all payments (optionally filter by studentId or groupId)
router.get('/', async (req, res) => {
  const { studentId, groupId } = req.query;
  try {
    const payments = await prisma.payment.findMany({
      where: {
        studentId: studentId ? String(studentId) : undefined,
        groupId: groupId ? String(groupId) : undefined,
      },
      include: { student: true, group: true },
      orderBy: { date: 'desc' }
    });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching payments' });
  }
});

// POST a new payment
router.post('/', async (req, res) => {
  try {
    const { studentId, amount, date, paymentMethod, status, reference, groupId } = req.body;
    if (!studentId || !amount || !date || !status) {
      return res.status(400).json({ error: 'Missing required fields: studentId, amount, date, status' });
    }

    const studentExists = await prisma.student.findUnique({ where: { id: studentId } });
    if (!studentExists) {
      return res.status(400).json({ error: 'Student not found' });
    }
    if (groupId) {
      const groupExists = await prisma.group.findUnique({ where: { id: groupId } });
      if (!groupExists) {
        return res.status(400).json({ error: 'Group not found' });
      }
    }

    const newPayment = await prisma.payment.create({
      data: {
        studentId,
        amount,
        date: new Date(date),
        paymentMethod,
        status,
        reference,
        groupId,
      },
      include: { student: true, group: true },
    });
    res.status(201).json(newPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating payment' });
  }
});

// GET a single payment by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { student: true, group: true },
    });
    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching payment' });
  }
});

// PUT to update a payment by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { studentId, amount, date, paymentMethod, status, reference, groupId } = req.body;

     if (studentId) {
         const studentExists = await prisma.student.findUnique({ where: { id: studentId } });
         if (!studentExists) return res.status(400).json({ error: 'Student not found for payment update' });
     }
     if (groupId) {
         const groupExists = await prisma.group.findUnique({ where: { id: groupId } });
         if (!groupExists) return res.status(400).json({ error: 'Group not found for payment update' });
     }


    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        studentId,
        amount,
        date: date ? new Date(date) : undefined,
        paymentMethod,
        status,
        reference,
        groupId,
        updatedAt: new Date(),
      },
      include: { student: true, group: true },
    });
    res.json(updatedPayment);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Payment not found for update' });
    }
    res.status(500).json({ error: 'Error updating payment' });
  }
});

// DELETE a payment by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.payment.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Payment not found for deletion' });
    }
    res.status(500).json({ error: 'Error deleting payment' });
  }
});

export default router;
