// backend/src/routes/attendances.ts
import { Router } from 'express';
import prisma from '../db';

const router = Router();

// GET all attendance records (optionally filter by sessionId or studentId)
router.get('/', async (req, res) => {
  const { sessionId, studentId } = req.query;
  try {
    const attendances = await prisma.attendance.findMany({
      where: {
        sessionId: sessionId ? String(sessionId) : undefined,
        studentId: studentId ? String(studentId) : undefined,
      },
      include: { session: true, student: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(attendances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching attendance records' });
  }
});

// POST to record attendance (can be for a single student or multiple)
// For simplicity, this endpoint handles a single student attendance record.
// Batch creation could be POST /api/sessions/:sessionId/attendances
router.post('/', async (req, res) => {
  try {
    const { sessionId, studentId, status, notes } = req.body;
    if (!sessionId || !studentId || !status) {
      return res.status(400).json({ error: 'Missing required fields: sessionId, studentId, status' });
    }

    const sessionExists = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!sessionExists) {
      return res.status(400).json({ error: 'Session not found' });
    }
    const studentExists = await prisma.student.findUnique({ where: { id: studentId } });
    if (!studentExists) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const newAttendance = await prisma.attendance.create({
      data: {
        sessionId,
        studentId,
        status,
        notes,
      },
      include: { session: true, student: true },
    });
    res.status(201).json(newAttendance);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') { // Unique constraint (sessionId, studentId)
         return res.status(409).json({ error: 'Attendance for this student in this session already recorded.' });
    }
    res.status(500).json({ error: 'Error recording attendance' });
  }
});

// GET a single attendance record by ID
router.get('/:id', async (req, res) => {
 const { id } = req.params;
 try {
     const attendance = await prisma.attendance.findUnique({
         where: { id },
         include: { session: true, student: true }
     });
     if (attendance) {
         res.json(attendance);
     } else {
         res.status(404).json({ error: "Attendance record not found" });
     }
 } catch (error) {
     console.error(error);
     res.status(500).json({ error: "Error fetching attendance record" });
 }
});


// PUT to update an attendance record by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { status, notes, sessionId, studentId } = req.body; // sessionId and studentId typically wouldn't change for an existing record

    const updatedAttendance = await prisma.attendance.update({
      where: { id },
      data: {
        status,
        notes,
        // sessionId, // Usually not changed
        // studentId, // Usually not changed
        updatedAt: new Date(),
      },
      include: { session: true, student: true },
    });
    res.json(updatedAttendance);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Attendance record not found for update' });
    }
    res.status(500).json({ error: 'Error updating attendance record' });
  }
});

// DELETE an attendance record by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.attendance.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Attendance record not found for deletion' });
    }
    res.status(500).json({ error: 'Error deleting attendance record' });
  }
});

export default router;
