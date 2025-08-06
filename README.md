# Client Cost Efficiency Simulator

A comprehensive web-based application that allows delivery managers and sales teams to simulate project costs and outcomes by adjusting delivery models. The simulator provides detailed cost analysis, risk assessment, and optimization recommendations.

## Features

### 🔧 Input Parameters
- **Total Team Size**: Configure the number of team members
- **Onshore vs Offshore Mix**: Adjust the percentage split between onshore and offshore resources
- **Automation Level**: Set the degree of process automation (0-100%)
- **Cloud Usage Level**: Configure cloud infrastructure utilization (0-100%)
- **Project Duration**: Specify project timeline in months

### 📊 Output Dashboard
- **Cost Estimation**: Detailed breakdown of project costs including labor, cloud, and automation setup
- **Delivery Time**: Estimated project completion time with optimizations
- **Risk Assessment**: Intelligent risk scoring with specific risk factors identified
- **Optimization Tips**: AI-powered recommendations for cost and efficiency improvements
- **Visual Charts**: Interactive pie charts and bar graphs for cost breakdown and trends
- **PDF Export**: Generate professional reports for stakeholder sharing

### 🎯 Advanced Features
- **Interactive Charts**: Cost breakdown, team composition, and monthly trends visualization
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Tooltips & Guidance**: Contextual help for all input parameters
- **Real-time Calculations**: Instant updates as parameters change
- **Professional PDF Reports**: Exportable detailed analysis reports

## Technology Stack

### Frontend
- **React 18**: Modern UI framework with hooks
- **Chart.js**: Interactive data visualization
- **CSS3**: Custom responsive styling with animations
- **Modern JavaScript**: ES6+ features

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Puppeteer**: PDF generation engine
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API protection

## Quick Start

### Prerequisites
- Node.js 14+ and npm installed
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client-cost-efficiency-simulator
   ```

2. **Install dependencies for all components**
   ```bash
   npm run install-all
   ```

3. **Start the development environment**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/health

### Alternative Setup

If you prefer to run components separately:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in a new terminal)
cd frontend
npm install
npm start
```

## API Documentation

### Endpoints

#### `POST /api/simulate`
Calculates project cost and risk assessment based on input parameters.

**Request Body:**
```json
{
  "teamSize": 10,
  "onshorePercentage": 70,
  "automationLevel": 50,
  "cloudUsageLevel": 60,
  "projectDurationMonths": 6
}
```

**Response:**
```json
{
  "estimatedCost": 432000,
  "estimatedDeliveryTime": 5.7,
  "riskLevel": "Medium",
  "riskFactors": ["Low automation level"],
  "optimizationTips": [
    {
      "category": "Automation",
      "tip": "Increase automation to reduce long-term costs",
      "impact": "High",
      "potentialSaving": "15-30%"
    }
  ],
  "costBreakdown": {
    "laborCost": 384000,
    "cloudCost": 43200,
    "automationSetupCost": 5000
  }
}
```

#### `POST /api/export-pdf`
Generates a PDF report of the simulation results.

**Request Body:**
```json
{
  "simulationData": { /* Complete simulation response object */ }
}
```

**Response:** PDF file download

#### `GET /api/health`
Health check endpoint for monitoring.

## Cost Calculation Algorithm

The simulator uses sophisticated algorithms to calculate costs and risks:

### Base Rates
- **Onshore**: $120/hour
- **Offshore**: $40/hour
- **Working Hours**: 160 hours/month
- **Cloud Base Cost**: $500/month per team member

### Calculations
1. **Labor Costs**: Team size × hourly rates × working hours × duration
2. **Automation Savings**: Up to 30% reduction in labor costs
3. **Cloud Costs**: Variable multiplier based on usage level (0.5x to 2x)
4. **Delivery Time**: Adjusted based on team composition, automation, and cloud usage

### Risk Assessment
Risk factors are automatically identified and scored:
- High offshore dependency (>70% offshore)
- Low automation level (<40%)
- High cloud dependency (>80%)
- Large team complexity (>20 members)
- Long project duration (>12 months)

## Project Structure

```
client-cost-efficiency-simulator/
├── backend/
│   ├── services/
│   │   └── simulationService.js    # Core calculation logic
│   ├── server.js                   # Express server setup
│   └── package.json               # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js          # Application header
│   │   │   ├── InputForm.js       # Parameter input form
│   │   │   └── Dashboard.js       # Results dashboard
│   │   ├── App.js                 # Main application component
│   │   └── App.css               # Application styles
│   └── package.json              # Frontend dependencies
├── package.json                  # Root package configuration
└── README.md                    # Project documentation
```

## Customization

### Modifying Cost Rates
Edit the `BASE_RATES` object in `/backend/services/simulationService.js`:

```javascript
const BASE_RATES = {
  onshore: 120,     // $/hour
  offshore: 40,     // $/hour
  workingHoursPerMonth: 160,
  cloudBaseCostPerMonth: 500,
  automationSetupCost: 10000
};
```

### Adding New Risk Factors
Extend the `RISK_FACTORS` object and update the risk calculation logic in the simulation service.

### Customizing UI Theme
Modify the CSS variables in `/frontend/src/App.css` to change colors and styling.

## Production Deployment

### Backend Deployment
1. Set environment variables:
   ```bash
   export PORT=5000
   export NODE_ENV=production
   ```

2. Install production dependencies:
   ```bash
   cd backend
   npm install --only=production
   ```

3. Start the server:
   ```bash
   npm start
   ```

### Frontend Deployment
1. Build the production bundle:
   ```bash
   cd frontend
   npm run build
   ```

2. Serve the build directory using a web server like Nginx or Apache.

### Docker Deployment
Consider containerizing both frontend and backend for easier deployment and scaling.

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
Use tools like Postman or curl to test API endpoints:

```bash
curl -X POST http://localhost:5000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"teamSize":10,"onshorePercentage":70,"automationLevel":50,"cloudUsageLevel":60,"projectDurationMonths":6}'
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**Backend server won't start:**
- Check if port 5000 is available
- Ensure all dependencies are installed
- Check Node.js version compatibility

**PDF export fails:**
- Ensure Puppeteer is properly installed
- Check system dependencies for headless Chrome
- Verify sufficient memory for PDF generation

**Charts not displaying:**
- Check browser console for JavaScript errors
- Ensure Chart.js dependencies are properly loaded
- Verify data format matches Chart.js requirements

**Frontend won't connect to backend:**
- Verify backend is running on port 5000
- Check CORS configuration
- Ensure API URLs are correct

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

## Roadmap

Future enhancements planned:
- [ ] Historical data tracking and comparison
- [ ] Multiple project comparison
- [ ] Advanced filtering and search
- [ ] Integration with project management tools
- [ ] Machine learning for improved predictions
- [ ] Multi-currency support
- [ ] Advanced reporting templates
- [ ] User authentication and project saving