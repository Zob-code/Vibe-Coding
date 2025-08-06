const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { simulateCosts, generatePDF } = require('./services/simulationService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cost Efficiency Simulator API is running' });
});

app.post('/api/simulate', (req, res) => {
  try {
    const {
      teamSize,
      onshorePercentage,
      automationLevel,
      cloudUsageLevel,
      projectDurationMonths
    } = req.body;

    // Validate input
    if (!teamSize || !onshorePercentage || automationLevel === undefined || 
        cloudUsageLevel === undefined || !projectDurationMonths) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        required: ['teamSize', 'onshorePercentage', 'automationLevel', 'cloudUsageLevel', 'projectDurationMonths']
      });
    }

    const simulation = simulateCosts({
      teamSize: Number(teamSize),
      onshorePercentage: Number(onshorePercentage),
      automationLevel: Number(automationLevel),
      cloudUsageLevel: Number(cloudUsageLevel),
      projectDurationMonths: Number(projectDurationMonths)
    });

    res.json(simulation);
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ error: 'Internal server error during simulation' });
  }
});

app.post('/api/export-pdf', async (req, res) => {
  try {
    const { simulationData } = req.body;
    
    if (!simulationData) {
      return res.status(400).json({ error: 'Simulation data is required' });
    }

    const pdfBuffer = await generatePDF(simulationData);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cost-simulation-report.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF report' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});