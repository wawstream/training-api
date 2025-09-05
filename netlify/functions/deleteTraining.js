const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    const DATA_FILE = path.join(__dirname, '../../data.json');
    
    let data = { trainings: [], participants: [] };
    if (fs.existsSync(DATA_FILE)) {
      data = JSON.parse(fs.readFileSync(DATA_FILE));
    }
    
    const { id } = JSON.parse(event.body);
    data.trainings = data.trainings.filter(t => t.id !== id);
    data.participants = data.participants.filter(p => p.training_id !== id);
    
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
