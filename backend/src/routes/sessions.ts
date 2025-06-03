// backend/src/routes/sessions.ts
import { Router } from 'express';
import prisma from '../db';

const router = Router();

// GET all sessions (optionally filter by groupId)
router.get('/', async (req, res) => {
  const { groupId } = req.query;
  try {
    const sessions = await prisma.session.findMany({
      where: {
        groupId: groupId ? String(groupId) : undefined,
      },
      include: { group: true, attendances: { include: { student: true } } },
      orderBy: { date: 'desc' }
    });
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching sessions' });
  }
});

// POST a new session
router.post('/', async (req, res) => {
  try {
    const { groupId, date, time, duration, topicCovered, notes } = req.body;
    if (!groupId || !date) {
      return res.status(400).json({ error: 'Missing required fields: groupId, date' });
    }

    const groupExists = await prisma.group.findUnique({ where: { id: groupId } });
    if (!groupExists) {
      return res.status(400).json({ error: 'Group not found' });
    }

    const newSession = await prisma.session.create({
      data: {
        groupId,
        date: new Date(date),
        time,
        duration,
        topicCovered,
        notes,
      },
      include: { group: true },
    });
    res.status(201).json(newSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating session' });
  }
});

// GET a single session by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const session = await prisma.session.findUnique({
      where: { id },
      include: { group: true, attendances: { include: { student: true } } },
    });
    if (session) {
      res.json(session);
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching session' });
  }
});

// PUT to update a session by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { date, time, duration, topicCovered, notes, groupId } = req.body;

    if(groupId) {
     const groupExists = await prisma.group.findUnique({ where: { id: groupId } });
     if (!groupExists) {
         return res.status(400).json({ error: 'Group not found for session update' });
     }
    }

    const updatedSession = await prisma.session.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
        time,
        duration,
        topicCovered,
        notes,
        groupId, // Allow changing the group if needed
        updatedAt: new Date(),
      },
      include: { group: true },
    });
    res.json(updatedSession);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Session not found for update' });
    }
    res.status(500).json({ error: 'Error updating session' });
  }
});

// DELETE a session by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Delete related attendance records first
    await prisma.attendance.deleteMany({
      where: { sessionId: id },
    });
    await prisma.session.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Session not found for deletion' });
    }
    res.status(500).json({ error: 'Error deleting session' });
  }
});

export default router;
