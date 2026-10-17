const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./timetable.db');
db.serialize(()=>{
  db.run(`CREATE TABLE IF NOT EXISTS timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT NOT NULL,
    course_name TEXT,
    day TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    lecturer TEXT,
    room TEXT
  )`);
});
module.exports = db;
