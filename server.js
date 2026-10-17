require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const PORT = process.env.PORT || 3000;

// GET all
app.get('/api/timetable', (req,res)=>{
  db.all('SELECT * FROM timetable ORDER BY id', (err,rows)=>{
    if(err) return res.status(500).json({error:err.message});
    res.json(rows);
  });
});

// POST new
app.post('/api/timetable', (req,res)=>{
  const {course_code, course_name, day, time_slot, lecturer, room} = req.body;
  console.log('SAVE:', req.body);
  if(!course_code || !day || !time_slot) return res.status(400).json({error:'Missing fields'});
  db.run(`INSERT INTO timetable (course_code, course_name, day, time_slot, lecturer, room) VALUES (?,?,?,?,?,?)`,
  [course_code, course_name, day, time_slot, lecturer, room],
  function(err){
    if(err) return res.status(500).json({error:err.message});
    db.get('SELECT * FROM timetable WHERE id=?', [this.lastID], (e,row)=>res.json(row));
  });
});

// PUT update
app.put('/api/timetable/:id', (req,res)=>{
  const {course_code, course_name, day, time_slot, lecturer, room} = req.body;
  db.run(`UPDATE timetable SET course_code=?, course_name=?, day=?, time_slot=?, lecturer=?, room=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
  [course_code, course_name, day, time_slot, lecturer, room, req.params.id],
  function(err){
    if(err) return res.status(500).json({error:err.message});
    db.get('SELECT * FROM timetable WHERE id=?', [req.params.id], (e,row)=>res.json(row));
  });
});

// DELETE
app.delete('/api/timetable/:id', (req,res)=>{
  db.run('DELETE FROM timetable WHERE id=?', [req.params.id], (err)=>{
    if(err) return res.status(500).json({error:err.message});
    res.json({deleted:true});
  });
});

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`));