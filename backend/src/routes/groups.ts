// backend/src/routes/groups.ts
import { Router } from 'express';
import prisma from '../db';

const router = Router();

// GET all groups
router.get('/', async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      include: { teacher: true, students: { include: { student: true } } }, // Include related teacher and students
    });
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching groups' });
  }
});

// POST a new group
router.post('/', async (req, res) => {
  try {
    const { name, level, subject, schedule, teacherId } = req.body;
    if (!name || !teacherId) {
      return res.status(400).json({ error: 'Missing required fields: name, teacherId' });
    }

    // Check if teacher exists
    const teacherExists = await prisma.teacher.findUnique({ where: { id: teacherId } });
    if (!teacherExists) {
      return res.status(400).json({ error: 'Teacher not found' });
    }

    const newGroup = await prisma.group.create({
      data: {
        name,
        level,
        subject,
        schedule,
        teacherId,
      },
      include: { teacher: true },
    });
    res.status(201).json(newGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating group' });
  }
});

// GET a single group by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const group = await prisma.group.findUnique({
      where: { id },
      include: { teacher: true, students: { include: { student: true } } },
    });
    if (group) {
      res.json(group);
    } else {
      res.status(404).json({ error: 'Group not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching group' });
  }
});

// PUT to update a group by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { name, level, subject, schedule, teacherId } = req.body;

    if (teacherId) {
     // Check if teacher exists if teacherId is being updated
     const teacherExists = await prisma.teacher.findUnique({ where: { id: teacherId } });
     if (!teacherExists) {
       return res.status(400).json({ error: 'Teacher not found for update' });
     }
    }

    const updatedGroup = await prisma.group.update({
      where: { id },
      data: {
        name,
        level,
        subject,
        schedule,
        teacherId,
        updatedAt: new Date(),
      },
      include: { teacher: true },
    });
    res.json(updatedGroup);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Group not found for update' });
    }
    res.status(500).json({ error: 'Error updating group' });
  }
});

// DELETE a group by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Need to delete related StudentGroup entries first due to foreign key constraints
    await prisma.studentGroup.deleteMany({
      where: { groupId: id },
    });
    // Need to delete related Session entries first
     await prisma.session.deleteMany({
         where: { groupId: id },
     });
     // Need to delete related Payment entries (if groupId is not nullable or handled differently)
     // Assuming payments can be orphaned or handled by setting groupId to null if schema allows.
     // For now, let's update payments to nullify groupId if they are associated with this group.
     await prisma.payment.updateMany({
         where: { groupId: id },
         data: { groupId: null }
     });


    await prisma.group.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Group not found for deletion' });
    }
    // Foreign key constraint errors might occur if other direct relations are not handled (e.g. Sessions)
    // P2003: Foreign key constraint failed on the field: `...`
    if (error.code === 'P2003'){
         console.error("Foreign key constraint failed. Details:", error.meta);
         return res.status(409).json({ error: 'Cannot delete group due to existing related records (e.g., sessions). Please delete them first.' });
    }
    res.status(500).json({ error: 'Error deleting group' });
  }
});

// --- Student-Group Association ---

// POST to assign a student to a group
 router.post('/:groupId/students', async (req, res) => {
     const { groupId } = req.params;
     const { studentId } = req.body;

     if (!studentId) {
         return res.status(400).json({ error: 'Missing required field: studentId' });
     }

     try {
         // Check if group exists
         const groupExists = await prisma.group.findUnique({ where: { id: groupId } });
         if (!groupExists) {
             return res.status(404).json({ error: 'Group not found' });
         }

         // Check if student exists
         const studentExists = await prisma.student.findUnique({ where: { id: studentId } });
         if (!studentExists) {
             return res.status(404).json({ error: 'Student not found' });
         }

         const studentGroup = await prisma.studentGroup.create({
             data: {
                 groupId,
                 studentId,
             },
             include: { student: true, group: true }
         });
         res.status(201).json(studentGroup);
     } catch (error) {
         console.error(error);
         if (error.code === 'P2002') { // Unique constraint violation (student already in group)
             return res.status(409).json({ error: 'Student is already in this group' });
         }
         res.status(500).json({ error: 'Error assigning student to group' });
     }
 });

 // DELETE to remove a student from a group
 router.delete('/:groupId/students/:studentId', async (req, res) => {
     const { groupId, studentId } = req.params;
     try {
         await prisma.studentGroup.delete({
             where: {
                 studentId_groupId: { // This refers to the @@unique([studentId, groupId]) constraint
                     studentId,
                     groupId,
                 },
             },
         });
         res.status(204).send();
     } catch (error) {
         console.error(error);
         if (error.code === 'P2025') { // Record to delete not found
             return res.status(404).json({ error: 'Student-group association not found' });
         }
         res.status(500).json({ error: 'Error removing student from group' });
     }
 });


export default router;
