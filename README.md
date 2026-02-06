# Onfleet Active Tasks Manager

A full-stack application to manage and monitor Onfleet teams, workers, and tasks in real-time.

## 🚀 Features

- **API Key Management**: Securely input and store Onfleet API key in the frontend
- **Teams Overview**: View all teams with worker and manager counts
- **Workers Dashboard**: Monitor active and inactive drivers with their current status
- **Tasks Management**: Track tasks across different states (Unassigned, Assigned, Active, Completed)
- **Real-time Updates**: Built with React Query for efficient data fetching and caching
- **Responsive Design**: Beautiful UI built with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Query (@tanstack/react-query)** - Data fetching and caching
- **Zustand** - State management
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **@onfleet/node-onfleet** - Official Onfleet SDK
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Onfleet API key (from your Onfleet dashboard)

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/alexanderbkl/onfleet-active-tasks.git
cd onfleet-active-tasks
```

2. Install all dependencies (root, backend, and frontend):
```bash
npm run install:all
```

Or install individually:
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

## 🚀 Running the Application

### Development Mode (Recommended)

Run both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend dev server on `http://localhost:5173`

### Running Individually

**Backend only:**
```bash
npm run server
# or
cd backend
npm start
```

**Frontend only:**
```bash
npm run client
# or
cd frontend
npm run dev
```

## 📖 Usage

1. **Start the application** using `npm run dev`
2. **Open your browser** and navigate to `http://localhost:5173`
3. **Enter your Onfleet API key** in the input field at the top
4. **View your data**:
   - Teams section shows all teams with worker counts
   - Workers section displays active and inactive drivers
   - Tasks section shows all tasks from the last 7 days, grouped by status

## 🔑 API Endpoints

The backend provides the following endpoints:

- `GET /api/health` - Health check
- `POST /api/teams` - Get all teams
- `POST /api/workers` - Get all workers
- `POST /api/tasks` - Get tasks (last 7 days by default)
- `POST /api/workers/:id` - Get specific worker by ID
- `POST /api/tasks/:id` - Get specific task by ID

All endpoints (except health check) require an `apiKey` in the request body.

## 🏗️ Project Structure

```
onfleet-active-tasks/
├── backend/
│   ├── server.js           # Express server and API routes
│   └── package.json        # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ApiKeyInput.jsx
│   │   │   ├── Teams.jsx
│   │   │   ├── Workers.jsx
│   │   │   └── Tasks.jsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   └── useOnfleet.js
│   │   ├── services/       # API service layer
│   │   │   └── api.js
│   │   ├── store/          # Zustand store
│   │   │   └── useStore.js
│   │   ├── App.jsx         # Main App component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   └── package.json        # Frontend dependencies
└── package.json            # Root package.json for scripts

```

## 🔒 Security Notes

- The API key is stored in browser's local storage (via Zustand persist)
- API key is transmitted to the backend via POST requests (not in URLs)
- Backend validates API key presence before making Onfleet API calls
- CORS is enabled for local development

**Important**: Never commit your API keys to version control. The `.env` files are gitignored by default.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Onfleet](https://onfleet.com/) for their excellent API and SDK
- Built with modern React ecosystem tools

## 📞 Support

For issues and questions, please open an issue on the GitHub repository.
