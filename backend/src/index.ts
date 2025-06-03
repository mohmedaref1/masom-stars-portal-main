// backend/src/index.ts
import express from 'express';
import studentRoutes from './routes/students';
import teacherRoutes from './routes/teachers';
import groupRoutes from './routes/groups';
import sessionRoutes from './routes/sessions';
import attendanceRoutes from './routes/attendances';
import paymentRoutes from './routes/payments'; // Import payment router
import financialRecordRoutes from './routes/financialRecords'; // Import financial record router
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.send('Backend API is running!');
});

app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/payments', paymentRoutes); // Mount payment router
app.use('/api/financial-records', financialRecordRoutes); // Mount financial record router

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
