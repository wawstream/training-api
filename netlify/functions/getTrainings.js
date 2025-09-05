const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
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
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([])
    };
  }
};
