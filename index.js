const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Путь к данным
const DATA_FILE = path.join(__dirname, 'data.json');

// Инициализация данных
function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  }
  return { trainings: [], participants: [] };
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /api/trainings
app.get('/api/trainings', (req, res) => {
  const data = loadData();
  const result = [];
  
  data.trainings.forEach(t => {
    const row = {
      id: t.id,
      title: t.title,
      date: t.date,
      group: t.group,
      desc: t.desc,
      participants: []
    };
    
    data.participants.forEach(p => {
      if (p.training_id == t.id) {
        row.participants.push(p.name);
      }
    });
    
    result.push(row);
  });
  
  res.json(result);
});

// POST /api/register
app.post('/api/register', (req, res) => {
  const { training_id, name } = req.body;
  const data = loadData();
  
  data.participants.push({ training_id, name });
  saveData(data);
  
  res.json({ success: true });
});

// POST /api/addTraining
app.post('/api/addTraining', (req, res) => {
  const { id, title, date, group, desc } = req.body;
  const data = loadData();
  
  data.trainings.push({ id, title, date, group, desc });
  saveData(data);
  
  res.json({ success: true });
});

// POST /api/deleteTraining
app.post('/api/deleteTraining', (req, res) => {
  const { id } = req.body;
  const data = loadData();
  
  data.trainings = data.trainings.filter(t => t.id !== id);
  data.participants = data.participants.filter(p => p.training_id !== id);
  
  saveData(data);
  res.json({ success: true });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
