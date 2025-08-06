const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'frontend/build')));

// API proxy to backend (if backend is running)
app.use('/api', (req, res) => {
  // Simple proxy to backend
  const backendUrl = 'http://localhost:5000' + req.url;
  
  const options = {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      ...req.headers
    }
  };

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      options.body = body;
      
      fetch(backendUrl, options)
        .then(response => {
          res.status(response.status);
          if (response.headers.get('content-type')?.includes('application/pdf')) {
            res.setHeader('Content-Type', 'application/pdf');
            return response.arrayBuffer();
          }
          return response.json();
        })
        .then(data => {
          if (data instanceof ArrayBuffer) {
            res.send(Buffer.from(data));
          } else {
            res.json(data);
          }
        })
        .catch(error => {
          console.error('Backend proxy error:', error);
          res.status(500).json({ error: 'Backend service unavailable' });
        });
    });
  } else {
    fetch(backendUrl, options)
      .then(response => response.json())
      .then(data => res.json(data))
      .catch(error => {
        console.error('Backend proxy error:', error);
        res.status(500).json({ error: 'Backend service unavailable' });
      });
  }
});

// The "catchall" handler: send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Cost Efficiency Simulator Demo Server running on port ${port}`);
  console.log(`📱 Access the application at: http://localhost:${port}`);
  console.log(`🌐 If running in a container, try: http://0.0.0.0:${port}`);
  console.log('');
  console.log('📊 Features available:');
  console.log('  ✅ Full React application');
  console.log('  ✅ Cost simulation with real-time updates');
  console.log('  ✅ Interactive charts and visualizations');
  console.log('  ✅ Risk assessment and optimization tips');
  console.log('  ✅ PDF export functionality (if backend is running)');
  console.log('');
  console.log('🔧 Backend status:');
  
  // Test backend connectivity
  fetch('http://localhost:5000/api/health')
    .then(response => response.json())
    .then(data => {
      console.log('  ✅ Backend API is running and accessible');
      console.log('  📡 Full functionality available including PDF export');
    })
    .catch(error => {
      console.log('  ⚠️  Backend API not accessible');
      console.log('  📝 Frontend will work with mock data');
    });
});