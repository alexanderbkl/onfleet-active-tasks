import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Onfleet API base URL
const ONFLEET_API_URL = 'https://onfleet.com/api/v2';

// Helper function to create Onfleet API client
const createOnfleetClient = (apiKey) => {
  return axios.create({
    baseURL: ONFLEET_API_URL,
    auth: {
      username: apiKey,
      password: ''
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

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

    const client = createOnfleetClient(apiKey);
    const response = await client.get('/teams');
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching teams:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch teams',
      message: error.response?.data?.message || error.message 
    });
  }
});

// Get workers with task counts
app.post('/api/workers', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const client = createOnfleetClient(apiKey);
    const response = await client.get('/workers');
    
    // Enhance workers with task counts
    const workersWithTasks = await Promise.all(
      response.data.map(async (worker) => {
        try {
          // Fetch tasks for this worker
          const tasksResponse = await client.get(`/workers/${worker.id}/tasks`);
          return {
            ...worker,
            tasks: tasksResponse.data || [],
            taskCount: tasksResponse.data?.length || 0
          };
        } catch (error) {
          // If fetching tasks fails, return worker with empty tasks
          console.error(`Error fetching tasks for worker ${worker.id}:`, error.message);
          return {
            ...worker,
            tasks: [],
            taskCount: 0
          };
        }
      })
    );
    
    res.json(workersWithTasks);
  } catch (error) {
    console.error('Error fetching workers:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch workers',
      message: error.response?.data?.message || error.message 
    });
  }
});

// Get tasks for a specific worker
app.post('/api/workers/:id/tasks', async (req, res) => {
  try {
    const { apiKey } = req.body;
    const { id } = req.params;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const client = createOnfleetClient(apiKey);
    const response = await client.get(`/workers/${id}/tasks`);
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching worker tasks:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch worker tasks',
      message: error.response?.data?.message || error.message 
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

    const client = createOnfleetClient(apiKey);
    
    // Get tasks within a time range (default: last 7 days)
    const toDate = to || Date.now();
    const fromDate = from || (toDate - 7 * 24 * 60 * 60 * 1000);
    
    const response = await client.get('/tasks/all', {
      params: {
        from: fromDate,
        to: toDate
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching tasks:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch tasks',
      message: error.response?.data?.message || error.message 
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

    const client = createOnfleetClient(apiKey);
    const response = await client.get(`/tasks/${id}`);
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching task:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch task',
      message: error.response?.data?.message || error.message 
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

    const client = createOnfleetClient(apiKey);
    const response = await client.get(`/workers/${id}`);
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching worker:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch worker',
      message: error.response?.data?.message || error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
