const puppeteer = require('puppeteer');

// Base rates and constants for cost calculation
const BASE_RATES = {
  onshore: 120, // $/hour
  offshore: 40, // $/hour
  workingHoursPerMonth: 160,
  cloudBaseCostPerMonth: 500,
  automationSetupCost: 10000
};

// Risk factors based on configuration
const RISK_FACTORS = {
  highOffshore: 0.3, // 30% or more offshore
  lowAutomation: 0.2, // Below 40% automation
  highCloudUsage: 0.15, // Above 80% cloud usage
  largeTeam: 0.25, // More than 20 people
  longDuration: 0.2 // More than 12 months
};

function simulateCosts(params) {
  const {
    teamSize,
    onshorePercentage,
    automationLevel,
    cloudUsageLevel,
    projectDurationMonths
  } = params;

  // Calculate team composition
  const onshoreTeamSize = Math.round(teamSize * (onshorePercentage / 100));
  const offshoreTeamSize = teamSize - onshoreTeamSize;

  // Calculate base labor costs
  const onshoreHourlyCost = onshoreTeamSize * BASE_RATES.onshore * BASE_RATES.workingHoursPerMonth;
  const offshoreHourlyCost = offshoreTeamSize * BASE_RATES.offshore * BASE_RATES.workingHoursPerMonth;
  const monthlyLaborCost = onshoreHourlyCost + offshoreHourlyCost;

  // Calculate automation impact
  const automationSavings = (automationLevel / 100) * monthlyLaborCost * 0.3; // 30% max savings
  const automationSetupCost = automationLevel > 0 ? BASE_RATES.automationSetupCost * (automationLevel / 100) : 0;
  const adjustedMonthlyLaborCost = monthlyLaborCost - automationSavings;

  // Calculate cloud costs
  const baseCloudCost = BASE_RATES.cloudBaseCostPerMonth * teamSize;
  const cloudMultiplier = 0.5 + (cloudUsageLevel / 100) * 1.5; // 0.5x to 2x multiplier
  const monthlyCloudCost = baseCloudCost * cloudMultiplier;

  // Calculate total costs
  const totalLaborCost = adjustedMonthlyLaborCost * projectDurationMonths;
  const totalCloudCost = monthlyCloudCost * projectDurationMonths;
  const totalProjectCost = totalLaborCost + totalCloudCost + automationSetupCost;

  // Calculate delivery time adjustment
  const baseDeliveryTime = projectDurationMonths;
  let deliveryTimeAdjustment = 0;
  
  // Automation reduces delivery time
  deliveryTimeAdjustment -= (automationLevel / 100) * 0.2; // Up to 20% reduction
  
  // High offshore percentage increases delivery time
  if (onshorePercentage < 70) {
    deliveryTimeAdjustment += 0.15; // 15% increase
  }
  
  // Cloud usage reduces delivery time
  deliveryTimeAdjustment -= (cloudUsageLevel / 100) * 0.1; // Up to 10% reduction
  
  const estimatedDeliveryTime = Math.max(baseDeliveryTime * (1 + deliveryTimeAdjustment), projectDurationMonths * 0.7);

  // Calculate risk assessment
  const riskFactors = [];
  let totalRiskScore = 0;

  if (onshorePercentage < 70) {
    riskFactors.push('High offshore dependency');
    totalRiskScore += RISK_FACTORS.highOffshore;
  }

  if (automationLevel < 40) {
    riskFactors.push('Low automation level');
    totalRiskScore += RISK_FACTORS.lowAutomation;
  }

  if (cloudUsageLevel > 80) {
    riskFactors.push('High cloud dependency');
    totalRiskScore += RISK_FACTORS.highCloudUsage;
  }

  if (teamSize > 20) {
    riskFactors.push('Large team coordination complexity');
    totalRiskScore += RISK_FACTORS.largeTeam;
  }

  if (projectDurationMonths > 12) {
    riskFactors.push('Long project duration');
    totalRiskScore += RISK_FACTORS.longDuration;
  }

  // Determine risk level
  let riskLevel;
  if (totalRiskScore <= 0.3) {
    riskLevel = 'Low';
  } else if (totalRiskScore <= 0.6) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'High';
  }

  // Generate optimization tips
  const optimizationTips = generateOptimizationTips(params, totalRiskScore);

  // Generate cost breakdown
  const costBreakdown = {
    laborCost: Math.round(totalLaborCost),
    cloudCost: Math.round(totalCloudCost),
    automationSetupCost: Math.round(automationSetupCost),
    monthlyCosts: {
      labor: Math.round(adjustedMonthlyLaborCost),
      cloud: Math.round(monthlyCloudCost)
    }
  };

  return {
    inputs: params,
    teamComposition: {
      onshore: onshoreTeamSize,
      offshore: offshoreTeamSize
    },
    estimatedCost: Math.round(totalProjectCost),
    estimatedDeliveryTime: Math.round(estimatedDeliveryTime * 10) / 10,
    riskLevel,
    riskFactors,
    riskScore: Math.round(totalRiskScore * 100) / 100,
    optimizationTips,
    costBreakdown,
    savings: {
      automationSavings: Math.round(automationSavings * projectDurationMonths),
      potentialSavings: Math.round(totalProjectCost * 0.15) // Potential 15% savings with optimization
    },
    timestamp: new Date().toISOString()
  };
}

function generateOptimizationTips(params, riskScore) {
  const tips = [];
  const { teamSize, onshorePercentage, automationLevel, cloudUsageLevel, projectDurationMonths } = params;

  if (automationLevel < 50) {
    tips.push({
      category: 'Automation',
      tip: 'Increase automation to reduce long-term costs and improve delivery speed',
      impact: 'High',
      potentialSaving: '15-30%'
    });
  }

  if (onshorePercentage > 80) {
    tips.push({
      category: 'Team Mix',
      tip: 'Consider a balanced onshore/offshore mix to optimize costs while maintaining quality',
      impact: 'Medium',
      potentialSaving: '20-40%'
    });
  }

  if (cloudUsageLevel < 30) {
    tips.push({
      category: 'Infrastructure',
      tip: 'Leverage cloud services to reduce infrastructure overhead and improve scalability',
      impact: 'Medium',
      potentialSaving: '10-20%'
    });
  }

  if (teamSize > 15 && projectDurationMonths > 8) {
    tips.push({
      category: 'Project Structure',
      tip: 'Consider breaking the project into smaller phases to reduce complexity and risk',
      impact: 'High',
      potentialSaving: '5-15%'
    });
  }

  if (riskScore > 0.5) {
    tips.push({
      category: 'Risk Mitigation',
      tip: 'Implement stronger project governance and communication protocols',
      impact: 'Medium',
      potentialSaving: '5-10%'
    });
  }

  if (tips.length === 0) {
    tips.push({
      category: 'General',
      tip: 'Your current configuration is well-optimized. Monitor progress and adjust as needed',
      impact: 'Low',
      potentialSaving: '0-5%'
    });
  }

  return tips;
}

async function generatePDF(simulationData) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    const html = generatePDFHTML(simulationData);
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
    return pdf;
  } finally {
    await browser.close();
  }
}

function generatePDFHTML(data) {
  const date = new Date(data.timestamp).toLocaleDateString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Cost Simulation Report</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #007bff;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #007bff;
          margin: 0;
          font-size: 28px;
        }
        .section {
          margin-bottom: 25px;
          padding: 15px;
          border-left: 4px solid #007bff;
          background-color: #f8f9fa;
        }
        .section h2 {
          color: #007bff;
          margin-top: 0;
          font-size: 20px;
        }
        .metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 15px 0;
        }
        .metric {
          background: white;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }
        .metric-label {
          font-weight: 600;
          color: #666;
          font-size: 14px;
        }
        .metric-value {
          font-size: 24px;
          font-weight: bold;
          color: #007bff;
        }
        .risk-high { color: #dc3545; }
        .risk-medium { color: #ffc107; }
        .risk-low { color: #28a745; }
        .tips {
          list-style: none;
          padding: 0;
        }
        .tip {
          background: white;
          margin: 10px 0;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #28a745;
        }
        .tip-category {
          font-weight: 600;
          color: #28a745;
        }
        .cost-breakdown {
          background: white;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
        }
        th, td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #dee2e6;
        }
        th {
          background-color: #f8f9fa;
          font-weight: 600;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #dee2e6;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Client Cost Efficiency Simulation Report</h1>
        <p>Generated on ${date}</p>
      </div>

      <div class="section">
        <h2>Project Overview</h2>
        <div class="metrics">
          <div class="metric">
            <div class="metric-label">Total Team Size</div>
            <div class="metric-value">${data.inputs.teamSize}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Project Duration</div>
            <div class="metric-value">${data.inputs.projectDurationMonths} months</div>
          </div>
          <div class="metric">
            <div class="metric-label">Onshore Percentage</div>
            <div class="metric-value">${data.inputs.onshorePercentage}%</div>
          </div>
          <div class="metric">
            <div class="metric-label">Automation Level</div>
            <div class="metric-value">${data.inputs.automationLevel}%</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Simulation Results</h2>
        <div class="metrics">
          <div class="metric">
            <div class="metric-label">Estimated Total Cost</div>
            <div class="metric-value">$${data.estimatedCost.toLocaleString()}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Estimated Delivery Time</div>
            <div class="metric-value">${data.estimatedDeliveryTime} months</div>
          </div>
          <div class="metric">
            <div class="metric-label">Risk Level</div>
            <div class="metric-value risk-${data.riskLevel.toLowerCase()}">${data.riskLevel}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Automation Savings</div>
            <div class="metric-value">$${data.savings.automationSavings.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Cost Breakdown</h2>
        <div class="cost-breakdown">
          <table>
            <thead>
              <tr>
                <th>Cost Category</th>
                <th>Amount</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Labor Costs</td>
                <td>$${data.costBreakdown.laborCost.toLocaleString()}</td>
                <td>${Math.round((data.costBreakdown.laborCost / data.estimatedCost) * 100)}%</td>
              </tr>
              <tr>
                <td>Cloud Infrastructure</td>
                <td>$${data.costBreakdown.cloudCost.toLocaleString()}</td>
                <td>${Math.round((data.costBreakdown.cloudCost / data.estimatedCost) * 100)}%</td>
              </tr>
              <tr>
                <td>Automation Setup</td>
                <td>$${data.costBreakdown.automationSetupCost.toLocaleString()}</td>
                <td>${Math.round((data.costBreakdown.automationSetupCost / data.estimatedCost) * 100)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      ${data.optimizationTips.length > 0 ? `
        <div class="section">
          <h2>Optimization Recommendations</h2>
          <ul class="tips">
            ${data.optimizationTips.map(tip => `
              <li class="tip">
                <div class="tip-category">${tip.category}</div>
                <div>${tip.tip}</div>
                <div style="font-size: 12px; color: #666; margin-top: 5px;">
                  Impact: ${tip.impact} | Potential Savings: ${tip.potentialSaving}
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      ${data.riskFactors.length > 0 ? `
        <div class="section">
          <h2>Risk Factors</h2>
          <ul>
            ${data.riskFactors.map(factor => `<li>${factor}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div class="footer">
        <p>This report was generated by the Client Cost Efficiency Simulator</p>
        <p>For questions or support, contact your delivery management team</p>
      </div>
    </body>
    </html>
  `;
}

module.exports = {
  simulateCosts,
  generatePDF
};