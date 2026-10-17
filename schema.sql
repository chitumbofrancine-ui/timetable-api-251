CREATE TABLE IF NOT EXISTS
 timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    day_of_week TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    room TEXT NOT NULL,
    goal TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO timetable
(course_code, course_name, day_of_week, start_time, end_time, room, goal)
VALUES
('ICT111', 'Introduction to Computing', 'Monday', '08:00', '10:00', 'Lab 1', 'Understand computer fundamentals'),
('CHE111', 'General Chemistry', 'Monday', '10:00', '12:00', 'Room 2', 'Master basic chemistry'),
('BIO111', 'General Biology', 'Tuesday', '08:00', '10:00', 'Room 3', 'Understand living organisms'),
('PHY101', 'Physics', 'Tuesday', '10:00', '12:00', 'Room 4', 'Improve problem-solving skills'),
('MSM111', 'Mathematics', 'Wednesday', '08:00', '10:00', 'Room 5', 'Practise mathematics daily'),
('ICT251', 'Web Technologies', 'Wednesday', '10:00', '12:00', 'Lab 2', 'Build functional websites'),
('CHE112', 'Chemistry II', 'Thursday', '08:00', '10:00', 'Room 6', 'Understand reaction rates'),
('BIO112', 'Biology II', 'Thursday', '10:00', '12:00', 'Room 7', 'Study biological processes'),
('PHY102', 'Physics II', 'Friday', '08:00', '10:00', 'Room 8', 'Practise physics calculations'),
('MSM112', 'Mathematics II', 'Friday', '10:00', '12:00', 'Room 5', 'Prepare for assessments');