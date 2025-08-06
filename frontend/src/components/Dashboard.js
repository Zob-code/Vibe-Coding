import React from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = ({ data }) => {
  const handleExportPDF = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ simulationData: data }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cost-simulation-report.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  // Prepare chart data
  const costBreakdownData = {
    labels: ['Labor Costs', 'Cloud Infrastructure', 'Automation Setup'],
    datasets: [
      {
        data: [
          data.costBreakdown.laborCost,
          data.costBreakdown.cloudCost,
          data.costBreakdown.automationSetupCost
        ],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ]
      }
    ]
  };

  const teamCompositionData = {
    labels: ['Onshore', 'Offshore'],
    datasets: [
      {
        data: [data.teamComposition.onshore, data.teamComposition.offshore],
        backgroundColor: ['#4BC0C0', '#FF9F40'],
        hoverBackgroundColor: ['#4BC0C0', '#FF9F40']
      }
    ]
  };

  const monthlyTrendsData = {
    labels: Array.from({ length: data.inputs.projectDurationMonths }, (_, i) => `Month ${i + 1}`),
    datasets: [
      {
        label: 'Labor Costs',
        data: Array(data.inputs.projectDurationMonths).fill(data.costBreakdown.monthlyCosts.labor),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Cloud Costs',
        data: Array(data.inputs.projectDurationMonths).fill(data.costBreakdown.monthlyCosts.cloud),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Cost Breakdown',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Simulation Results</h2>
        <button onClick={handleExportPDF} className="btn btn-export">
          📄 Export PDF Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <h3>Total Project Cost</h3>
          <div className="metric-value">${data.estimatedCost.toLocaleString()}</div>
          <div className="metric-subtitle">
            Potential savings: ${data.savings.potentialSavings.toLocaleString()}
          </div>
        </div>

        <div className="metric-card">
          <h3>Delivery Time</h3>
          <div className="metric-value">{data.estimatedDeliveryTime} months</div>
          <div className="metric-subtitle">
            {data.estimatedDeliveryTime < data.inputs.projectDurationMonths 
              ? `${(data.inputs.projectDurationMonths - data.estimatedDeliveryTime).toFixed(1)} months saved`
              : data.estimatedDeliveryTime > data.inputs.projectDurationMonths
              ? `${(data.estimatedDeliveryTime - data.inputs.projectDurationMonths).toFixed(1)} months delay`
              : 'On schedule'
            }
          </div>
        </div>

        <div className="metric-card" style={{ borderLeft: `4px solid ${getRiskColor(data.riskLevel)}` }}>
          <h3>Risk Assessment</h3>
          <div className="metric-value" style={{ color: getRiskColor(data.riskLevel) }}>
            {data.riskLevel}
          </div>
          <div className="metric-subtitle">
            Risk score: {(data.riskScore * 100).toFixed(0)}%
          </div>
        </div>

        <div className="metric-card">
          <h3>Automation Savings</h3>
          <div className="metric-value">${data.savings.automationSavings.toLocaleString()}</div>
          <div className="metric-subtitle">
            From {data.inputs.automationLevel}% automation
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Cost Breakdown</h3>
          <div className="chart-wrapper">
            <Pie data={costBreakdownData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-container">
          <h3>Team Composition</h3>
          <div className="chart-wrapper">
            <Pie data={teamCompositionData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-container full-width">
          <div className="chart-wrapper">
            <Bar data={monthlyTrendsData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      {data.riskFactors && data.riskFactors.length > 0 && (
        <div className="section">
          <h3>Risk Factors</h3>
          <div className="risk-factors">
            {data.riskFactors.map((factor, index) => (
              <div key={index} className="risk-factor">
                <span className="risk-icon">⚠️</span>
                {factor}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimization Tips */}
      {data.optimizationTips && data.optimizationTips.length > 0 && (
        <div className="section">
          <h3>Optimization Recommendations</h3>
          <div className="optimization-tips">
            {data.optimizationTips.map((tip, index) => (
              <div key={index} className="tip-card">
                <div className="tip-header">
                  <span className="tip-category">{tip.category}</span>
                  <span className={`tip-impact impact-${tip.impact.toLowerCase()}`}>
                    {tip.impact} Impact
                  </span>
                </div>
                <p className="tip-text">{tip.tip}</p>
                <div className="tip-savings">
                  Potential Savings: {tip.potentialSaving}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Details */}
      <div className="section">
        <h3>Team Configuration</h3>
        <div className="team-details">
          <div className="team-detail">
            <span className="label">Total Team Size:</span>
            <span className="value">{data.inputs.teamSize} members</span>
          </div>
          <div className="team-detail">
            <span className="label">Onshore Team:</span>
            <span className="value">{data.teamComposition.onshore} members ({data.inputs.onshorePercentage}%)</span>
          </div>
          <div className="team-detail">
            <span className="label">Offshore Team:</span>
            <span className="value">{data.teamComposition.offshore} members ({100 - data.inputs.onshorePercentage}%)</span>
          </div>
          <div className="team-detail">
            <span className="label">Automation Level:</span>
            <span className="value">{data.inputs.automationLevel}%</span>
          </div>
          <div className="team-detail">
            <span className="label">Cloud Usage:</span>
            <span className="value">{data.inputs.cloudUsageLevel}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;