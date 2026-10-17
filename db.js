const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./timetable.db');

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS timetable`);
  db.run(`CREATE TABLE timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT NOT NULL,
    course_name TEXT,
    day TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    lecturer TEXT,
    room TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, () => {
    const data = [
      ['ICT261','Computer Networks','Monday','11:00-13:00','NYIRENDA E. (MR.)','SSS BLOCK-E RM 1'],
      ['ICT221','Object Oriented Programming','Tuesday','9:00-11:00','ZULU G. (MR.)','SSS BLOCK-B RM 1'],
      ['ICT241','Operating Systems','Tuesday','15:00-17:00','ZULU G. (MR.)','G 51'],
      ['ICT221','Object Oriented Programming','Wednesday','9:00-11:00','ZULU G. (MR.)','F 58'],
      ['ICT241','Operating Systems','Wednesday','11:00-13:00','ZULU G. (MR.)','G 51'],
      ['ICT402','Software Project Management','Wednesday','13:00-15:00','MUSONDA P. (MR.)','G 51'],
      ['ICT261','Computer Networks','Wednesday','15:00-17:00','NYIRENDA E. (MR.)','NEW DINNING HALL'],
      ['ICT251','Web Technologies','Thursday','9:00-11:00','KALUBA Z. (MR.)','SSS BLOCK-B RM 2'],
      ['ICT402','Software Project Management','Thursday','13:00-15:00','MUSONDA P. (MR.)','G 46'],
      ['ICT251','Web Technologies','Friday','13:00-15:00','KALUBA Z. (MR.)','SSS BLOCK-C RM 2']
    ];
    const stmt = db.prepare(`INSERT INTO timetable (course_code, course_name, day, time_slot, lecturer, room) VALUES (?,?,?,?,?,?)`);
    data.forEach(d => stmt.run(d));
    stmt.finalize(() => {
      console.log('10 courses inserted - ready');
    });
  });
});

module.exports = db