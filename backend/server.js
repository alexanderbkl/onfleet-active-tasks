const express = require('express');
const cors = require('cors');
const Onfleet = require('@onfleet/node-onfleet');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get teams
app.post('/api/teams', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const onfleet = new Onfleet(apiKey);
    const teams = await onfleet.teams.get();
    
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ 
      error: 'Failed to fetch teams',
      message: error.message 
    });
  }
});

// Get workers
app.post('/api/workers', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const onfleet = new Onfleet(apiKey);
    const workers = await onfleet.workers.get();
    
    res.json(workers);
  } catch (error) {
    console.error('Error fetching workers:', error);
    res.status(500).json({ 
      error: 'Failed to fetch workers',
      message: error.message 
    });
  }
});

// Get tasks
app.post('/api/tasks', async (req, res) => {
  try {
    const { apiKey, from, to } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const onfleet = new Onfleet(apiKey);
    
    // Get tasks within a time range (default: last 7 days)
    const toDate = to || Date.now();
    const fromDate = from || (toDate - 7 * 24 * 60 * 60 * 1000);
    
    const tasks = await onfleet.tasks.get({
      from: fromDate,
      to: toDate
    });
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ 
      error: 'Failed to fetch tasks',
      message: error.message 
    });
  }
});

// Get task by ID
app.post('/api/tasks/:id', async (req, res) => {
  try {
    const { apiKey } = req.body;
    const { id } = req.params;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const onfleet = new Onfleet(apiKey);
    const task = await onfleet.tasks.get(id);
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ 
      error: 'Failed to fetch task',
      message: error.message 
    });
  }
});

// Get worker by ID
app.post('/api/workers/:id', async (req, res) => {
  try {
    const { apiKey } = req.body;
    const { id } = req.params;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const onfleet = new Onfleet(apiKey);
    const worker = await onfleet.workers.get(id);
    
    res.json(worker);
  } catch (error) {
    console.error('Error fetching worker:', error);
    res.status(500).json({ 
      error: 'Failed to fetch worker',
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
