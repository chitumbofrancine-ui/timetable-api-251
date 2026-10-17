const API = '/api/timetable';
let all = [];
const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
const slots = ["7:00-9:00","9:00-11:00","11:00-13:00","13:00-15:00","15:00-17:00","17:00-19:00"];

async function loadData(){
  try{
    const res = await fetch(API);
    if(!res.ok) throw new Error('API failed');
    all = await res.json();
  }catch(e){
    console.error('API error, using empty', e);
    all = [];
    document.getElementById('tbody').innerHTML = `<tr><td colspan="7" style="color:red;padding:20px">Backend not running! Run: cd backend && node server.js<br>Error: ${e.message}</td></tr>`;
    return;
  }

  const tbody = document.getElementById('tbody');
  tbody.innerHTML = days.map(day=>{
    let row = `<tr><td class="day">${day}</td>`;
    slots.forEach(slot=>{
      const f = all.find(x=>x.day===day && x.time_slot===slot);
      if(f){
        row += `<td class="slot" onclick="editItem(${f.id})" title="Click to edit"><div class="box"><b>${f.course_code}</b><br>${f.course_name||''}<br>${f.lecturer}<br><small><b>${f.room}</b></small></div></td>`;
      }else{
        row += `<td class="slot" onclick="addNew('${day}','${slot}')" title="Click to add course"></td>`;
      }
    });
    return row+`</tr>`;
  }).join('');
}

function addNew(day, slot){
  clearForm();
  document.getElementById('day').value = day;
  document.getElementById('time_slot').value = slot;
  document.getElementById('formTitle').innerText = `Add New Course - ${day} ${slot}`;
  document.getElementById('course_code').focus();
  window.scrollTo(0, document.body.scrollHeight);
}

function editItem(id){
  const item = all.find(x=>x.id===id);
  if(!item) return;
  document.getElementById('edit_id').value = item.id;
  document.getElementById('day').value = item.day;
  document.getElementById('time_slot').value = item.time_slot;
  document.getElementById('course_code').value = item.course_code;
  document.getElementById('course_name').value = item.course_name || '';
  document.getElementById('lecturer').value = item.lecturer || '';
  document.getElementById('room').value = item.room || '';
  document.getElementById('formTitle').innerText = `Editing ${item.course_code} - ${item.day} ${item.time_slot}`;
  document.getElementById('delBtn').style.display = 'inline-block';
  window.scrollTo(0, document.body.scrollHeight);
}

async function deleteId(id){
  if(!confirm('Delete this course?')) return;
  await fetch(`${API}/${id}`, {method:'DELETE'});
  loadData();
}

async function deleteOne(){
  const id = document.getElementById('edit_id').value;
  if(id) {
    await deleteId(id);
    clearForm();
  }
}

async function clearAll(){
  if(!confirm('Delete ALL 10 courses? This will empty timetable.')) return;
  for(const item of all){
    await fetch(`${API}/${item.id}`, {method:'DELETE'});
  }
  loadData();
}

document.getElementById('mainForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const id = document.getElementById('edit_id').value;
  const payload = {
    day: document.getElementById('day').value,
    time_slot: document.getElementById('time_slot').value,
    course_code: document.getElementById('course_code').value,
    course_name: document.getElementById('course_name').value,
    lecturer: document.getElementById('lecturer').value,
    room: document.getElementById('room').value
  };
  const url = id ? `${API}/${id}` : API;
  const method = id ? 'PUT' : 'POST';
  const res = await fetch(url, {method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
  if(!res.ok){
    const err = await res.json();
    alert('Save failed: ' + (err.error||'unknown'));
    return;
  }
  clearForm();
  loadData();
});

function clearForm(){
  document.getElementById('mainForm').reset();
  document.getElementById('edit_id').value='';
  document.getElementById('formTitle').innerText='Add / Edit Course';
  document.getElementById('delBtn').style.display='none';
}

loadData();