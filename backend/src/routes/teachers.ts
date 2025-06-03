// backend/src/routes/teachers.ts
import { Router } from 'express';
import prisma from '../db'; // Import the Prisma client instance

const router = Router();

// GET all teachers
router.get('/', async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany();
    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching teachers' });
  }
});

// POST a new teacher
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, subjectTaught, phoneNumber, compensationRate } = req.body;
    // Basic validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'Missing required fields: firstName, lastName, email' });
    }
    const newTeacher = await prisma.teacher.create({
      data: {
        firstName,
        lastName,
        email,
        subjectTaught,
        phoneNumber,
        compensationRate,
      },
    });
    res.status(201).json(newTeacher);
  } catch (error) {
    console.error(error);
    // Check for unique constraint violation for email
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Error creating teacher' });
  }
});

// GET a single teacher by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
    });
    if (teacher) {
      res.json(teacher);
    } else {
      res.status(404).json({ error: 'Teacher not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching teacher' });
  }
});

// PUT to update a teacher by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { firstName, lastName, email, subjectTaught, phoneNumber, compensationRate } = req.body;
    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        subjectTaught,
        phoneNumber,
        compensationRate,
        updatedAt: new Date(), // Manually update updatedAt
      },
    });
    res.json(updatedTeacher);
  } catch (error) {
    console.error(error);
     if (error.code === 'P2025') { // Prisma's code for record not found on update
         return res.status(404).json({ error: 'Teacher not found for update' });
     }
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Error updating teacher' });
  }
});

// DELETE a teacher by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.teacher.delete({
      where: { id },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') { // Prisma's code for record not found on delete
         return res.status(404).json({ error: 'Teacher not found for deletion' });
    }
    res.status(500).json({ error: 'Error deleting teacher' });
  }
});

export default router;
