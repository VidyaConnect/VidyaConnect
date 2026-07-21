const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateJWT = require('../middleware/authenticateJWT');

// POST /api/attendance - mark attendance
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { studentId, classId, date, status } = req.body;
    const schoolId = req.user.school_id;
    const markedBy = req.user.sub;

    const result = await pool.query(
      `INSERT INTO attendance (school_id, student_id, class_id, date, status, marked_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [schoolId, studentId, classId, date, status, markedBy]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

module.exports = router;