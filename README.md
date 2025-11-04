# Portfolio App

A modern portfolio website with a React frontend and Express backend API for managing personal and professional details.

## Features

- **Dynamic Content**: All personal and professional information is served from a backend API
- **Responsive Design**: Modern UI with Tailwind CSS and Framer Motion animations
- **RESTful API**: Express.js backend with endpoints for personal and professional data
- **Easy Updates**: Update your portfolio data by editing the JSON file or using API endpoints

## Project Structure

```
portfolio-app/
├── backend/
│   ├── server.js      # Express server with API endpoints
│   └── data.json      # Personal and professional data
├── src/
│   ├── services/
│   │   └── api.js     # API service functions
│   ├── components/    # UI components
│   └── App.jsx        # Main application
└── public/            # Static assets
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the backend server:
```bash
npm run server
```

3. In a new terminal, start the frontend:
```bash
npm run dev
```

Or run both simultaneously (requires `concurrently`):
```bash
npm install -g concurrently
npm run dev:all
```

### Backend API

The backend server runs on `http://localhost:3001` by default.

#### Available Endpoints

- `GET /api/personal` - Get all personal information
- `GET /api/professional` - Get all professional information
- `GET /api/profile` - Get complete profile (personal + professional)
- `GET /api/skills` - Get skills list
- `GET /api/experience` - Get work experience
- `GET /api/projects` - Get projects
- `GET /api/personal/:field` - Get specific personal field
- `PUT /api/personal` - Update personal information
- `PUT /api/professional` - Update professional information
- `GET /api/health` - Health check

### Updating Your Data

Edit `backend/data.json` to update your personal and professional information. The changes will be reflected immediately when you refresh the frontend.

#### Example API Call

```javascript
// Update personal information
fetch('http://localhost:3001/api/personal', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Your Name',
    title: 'Your Title',
    bio: 'Your bio'
  })
})
```

### Environment Variables

Create a `.env` file in the root directory to customize the API URL:

```
VITE_API_URL=http://localhost:3001/api
```

### Building for Production

1. Build the frontend:
```bash
npm run build
```

2. The backend can be run with:
```bash
npm run server
```

Or use a process manager like PM2 for production:
```bash
pm2 start backend/server.js
```

## Tech Stack

- **Frontend**: React, React Router, Framer Motion, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Data Storage**: JSON file (can be easily migrated to a database)

## License

MIT

