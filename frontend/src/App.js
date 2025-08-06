import React, { useState } from 'react';
import './App.css';
import InputForm from './components/InputForm';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

function App() {
  const [simulationData, setSimulationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSimulation = async (inputData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSimulationData(data);
    } catch (error) {
      console.error('Simulation error:', error);
      setError('Failed to run simulation. Please check if the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSimulationData(null);
    setError(null);
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="container">
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => setError(null)} className="btn btn-secondary">
                Dismiss
              </button>
            </div>
          )}
          
          <div className="app-layout">
            <div className="input-section">
              <InputForm 
                onSimulate={handleSimulation} 
                isLoading={isLoading}
                onReset={handleReset}
              />
            </div>
            
            <div className="dashboard-section">
              {simulationData ? (
                <Dashboard data={simulationData} />
              ) : (
                <div className="placeholder">
                  <div className="placeholder-content">
                    <h3>Welcome to Cost Efficiency Simulator</h3>
                    <p>Fill in the form parameters and click "Run Simulation" to see your project cost analysis.</p>
                    <div className="placeholder-features">
                      <div className="feature">
                        <span className="feature-icon">💰</span>
                        <span>Cost Estimation</span>
                      </div>
                      <div className="feature">
                        <span className="feature-icon">⏱️</span>
                        <span>Delivery Timeline</span>
                      </div>
                      <div className="feature">
                        <span className="feature-icon">⚠️</span>
                        <span>Risk Assessment</span>
                      </div>
                      <div className="feature">
                        <span className="feature-icon">💡</span>
                        <span>Optimization Tips</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
