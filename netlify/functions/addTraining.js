const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  // Проверка OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Max-Age': '3600',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }

  try {
    const DATA_FILE = path.join(__dirname, '../../data.json');
    
    let data = { trainings: [], participants: [] };
    if (fs.existsSync(DATA_FILE)) {
      data = JSON.parse(fs.readFileSync(DATA_FILE));
    }
    
    const { id, title, date, group, desc } = JSON.parse(event.body);
    data.trainings.push({ id, title, date, group, desc });
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};
