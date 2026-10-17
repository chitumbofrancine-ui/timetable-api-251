const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.get('/api/timetable',(req,res)=>{
  db.all("SELECT * FROM timetable ORDER BY day, time_slot",(err,rows)=>{
    if(err) return res.status(500).json({error:err.message});
    res.json(rows);
  });
});
app.post('/api/timetable',(req,res)=>{
  const b=req.body;
  if(!b.course_code||!b.day||!b.time_slot) return res.status(400).json({error:"Missing"});
  db.get("SELECT * FROM timetable WHERE day=? AND time_slot=? AND (room=? OR lecturer=?)",
    [b.day,b.time_slot,b.room,b.lecturer],(err,row)=>{
    if(row) return res.status(409).json({error:`Conflict with ${row.course_code}`});
    db.run("INSERT INTO timetable (course_code,course_name,day,time_slot,lecturer,room) VALUES (?,?,?,?,?,?)",
      [b.course_code,b.course_name,b.day,b.time_slot,b.lecturer,b.room],function(err){
      if(err) return res.status(500).json({error:err.message});
      db.get("SELECT * FROM timetable WHERE id=?",[this.lastID],(e,r)=>res.status(201).json(r));
    });
  });
});
app.put('/api/timetable/:id',(req,res)=>{
  const b=req.body;
  db.run("UPDATE timetable SET course_code=?,course_name=?,day=?,time_slot=?,lecturer=?,room=? WHERE id=?",
    [b.course_code,b.course_name,b.day,b.time_slot,b.lecturer,b.room,req.params.id],function(err){
    if(err) return res.status(500).json({error:err.message});
    db.get("SELECT * FROM timetable WHERE id=?",[req.params.id],(e,r)=>res.json(r));
  });
});
app.delete('/api/timetable/:id',(req,res)=>{
  db.run("DELETE FROM timetable WHERE id=?",[req.params.id],function(err){
    if(err) return res.status(500).json({error:err.message});
    res.json({deleted:true});
  });
});
app.get('*',(req,res)=>{res.sendFile(path.join(__dirname,'index.html'));});
app.listen(PORT,()=>console.log('Server running on port '+PORT));
