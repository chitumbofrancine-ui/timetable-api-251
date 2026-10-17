const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const PORT = process.env.PORT || 3000;

// GET all
app.get('/api/timetable', (req, res) => {
  db.all('SELECT * FROM timetable', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET one
app.get('/api/timetable/:id', (req, res) => {
  db.get('SELECT * FROM timetable WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: 'Record not found' });
    res.json(row);
  });
});

// POST
app.post('/api/timetable', (req, res) => {
  const { course_code, course_name, day_of_week, start_time, end_time, room, goal } = req.body;
  db.run(
    `INSERT INTO timetable (course_code, course_name, day_of_week, start_time, end_time, room, goal) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [course_code, course_name, day_of_week, start_time, end_time, room, goal],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, message: 'Created' });
    }
  );
});

// PUT - THIS WAS BROKEN IN YOUR CODE
app.put('/api/timetable/:id', (req, res) => {
  const { course_code, course_name, day_of_week, start_time, end_time, room, goal } = req.body;
  db.run(
    `UPDATE timetable SET course_code=?, course_name=?, day_of_week=?, start_time=?, end_time=?, room=?, goal=? WHERE id=?`,
    [course_code, course_name, day_of_week, start_time, end_time, room, goal, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Record updated successfully' });
    }
  );
});

// DELETE
app.delete('/api/timetable/:id', (req, res) => {
  db.run('DELETE FROM timetable WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Record deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});