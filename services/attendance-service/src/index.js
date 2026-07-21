require('dotenv').config();
const express = require('express');
const attendanceRoutes = require('./routes/attendance');

const app = express();
app.use(express.json());
app.use('/api/attendance', attendanceRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Attendance service running on port ${PORT}`));