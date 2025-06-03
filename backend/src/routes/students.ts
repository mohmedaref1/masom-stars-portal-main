// backend/src/routes/students.ts
import { Router } from 'express';
import prisma from '../db'; // Import the Prisma client instance

const router = Router();

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching students' });
  }
});

// POST a new student
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, dob, address, phoneNumber, level } = req.body;
    // Basic validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'Missing required fields: firstName, lastName, email' });
    }
    const newStudent = await prisma.student.create({
      data: {
        firstName,
        lastName,
        email,
        dob: dob ? new Date(dob) : null,
        address,
        phoneNumber,
        level,
      },
    });
    res.status(201).json(newStudent);
  } catch (error) {
    console.error(error);
    // Check for unique constraint violation for email
    // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Error creating student' });
  }
});

// GET a single student by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await prisma.student.findUnique({
      where: { id },
    });
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching student' });
  }
});

// PUT to update a student by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { firstName, lastName, email, dob, address, phoneNumber, level } = req.body;
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        dob: dob ? new Date(dob) : undefined, // Use undefined to skip update if not provided
        address,
        phoneNumber,
        level,
        updatedAt: new Date(), // Manually update updatedAt
      },
    });
    res.json(updatedStudent);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') { // Prisma's code for record not found on update
        return res.status(404).json({ error: 'Student not found for update' });
    }
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Error updating student' });
  }
});

// DELETE a student by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.student.delete({
      where: { id },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') { // Prisma's code for record not found on delete
        return res.status(404).json({ error: 'Student not found for deletion' });
    }
    res.status(500).json({ error: 'Error deleting student' });
  }
});

export default router;
