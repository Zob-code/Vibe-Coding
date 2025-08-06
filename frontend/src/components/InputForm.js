import React, { useState } from 'react';

const InputForm = ({ onSimulate, isLoading, onReset }) => {
  const [formData, setFormData] = useState({
    teamSize: 10,
    onshorePercentage: 70,
    automationLevel: 50,
    cloudUsageLevel: 60,
    projectDurationMonths: 6
  });

  const [showTooltip, setShowTooltip] = useState(null);

  const tooltips = {
    teamSize: "Total number of team members working on the project",
    onshorePercentage: "Percentage of team members working onshore (typically higher cost but lower risk)",
    automationLevel: "Level of automation in development, testing, and deployment processes",
    cloudUsageLevel: "Percentage of infrastructure and services hosted in the cloud",
    projectDurationMonths: "Expected duration of the project in months"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSimulate(formData);
  };

  const handleReset = () => {
    setFormData({
      teamSize: 10,
      onshorePercentage: 70,
      automationLevel: 50,
      cloudUsageLevel: 60,
      projectDurationMonths: 6
    });
    onReset();
  };

  const showTooltipHandler = (field) => {
    setShowTooltip(field);
  };

  const hideTooltipHandler = () => {
    setShowTooltip(null);
  };

  return (
    <div className="input-form-container">
      <h2>Project Parameters</h2>
      <form onSubmit={handleSubmit} className="input-form">
        
        <div className="form-group">
          <label htmlFor="teamSize">
            Total Team Size
            <button
              type="button"
              className="tooltip-trigger"
              onMouseEnter={() => showTooltipHandler('teamSize')}
              onMouseLeave={hideTooltipHandler}
              onClick={() => setShowTooltip(showTooltip === 'teamSize' ? null : 'teamSize')}
            >
              ?
            </button>
          </label>
          <input
            type="number"
            id="teamSize"
            name="teamSize"
            value={formData.teamSize}
            onChange={handleInputChange}
            min="1"
            max="100"
            required
          />
          {showTooltip === 'teamSize' && (
            <div className="tooltip">{tooltips.teamSize}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="onshorePercentage">
            Onshore vs Offshore (% Onshore)
            <button
              type="button"
              className="tooltip-trigger"
              onMouseEnter={() => showTooltipHandler('onshorePercentage')}
              onMouseLeave={hideTooltipHandler}
              onClick={() => setShowTooltip(showTooltip === 'onshorePercentage' ? null : 'onshorePercentage')}
            >
              ?
            </button>
          </label>
          <div className="slider-container">
            <input
              type="range"
              id="onshorePercentage"
              name="onshorePercentage"
              value={formData.onshorePercentage}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="slider"
            />
            <span className="slider-value">{formData.onshorePercentage}%</span>
          </div>
          {showTooltip === 'onshorePercentage' && (
            <div className="tooltip">{tooltips.onshorePercentage}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="automationLevel">
            Automation Level
            <button
              type="button"
              className="tooltip-trigger"
              onMouseEnter={() => showTooltipHandler('automationLevel')}
              onMouseLeave={hideTooltipHandler}
              onClick={() => setShowTooltip(showTooltip === 'automationLevel' ? null : 'automationLevel')}
            >
              ?
            </button>
          </label>
          <div className="slider-container">
            <input
              type="range"
              id="automationLevel"
              name="automationLevel"
              value={formData.automationLevel}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="slider"
            />
            <span className="slider-value">{formData.automationLevel}%</span>
          </div>
          {showTooltip === 'automationLevel' && (
            <div className="tooltip">{tooltips.automationLevel}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="cloudUsageLevel">
            Cloud Usage Level
            <button
              type="button"
              className="tooltip-trigger"
              onMouseEnter={() => showTooltipHandler('cloudUsageLevel')}
              onMouseLeave={hideTooltipHandler}
              onClick={() => setShowTooltip(showTooltip === 'cloudUsageLevel' ? null : 'cloudUsageLevel')}
            >
              ?
            </button>
          </label>
          <div className="slider-container">
            <input
              type="range"
              id="cloudUsageLevel"
              name="cloudUsageLevel"
              value={formData.cloudUsageLevel}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="slider"
            />
            <span className="slider-value">{formData.cloudUsageLevel}%</span>
          </div>
          {showTooltip === 'cloudUsageLevel' && (
            <div className="tooltip">{tooltips.cloudUsageLevel}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="projectDurationMonths">
            Project Duration (months)
            <button
              type="button"
              className="tooltip-trigger"
              onMouseEnter={() => showTooltipHandler('projectDurationMonths')}
              onMouseLeave={hideTooltipHandler}
              onClick={() => setShowTooltip(showTooltip === 'projectDurationMonths' ? null : 'projectDurationMonths')}
            >
              ?
            </button>
          </label>
          <input
            type="number"
            id="projectDurationMonths"
            name="projectDurationMonths"
            value={formData.projectDurationMonths}
            onChange={handleInputChange}
            min="1"
            max="36"
            required
          />
          {showTooltip === 'projectDurationMonths' && (
            <div className="tooltip">{tooltips.projectDurationMonths}</div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Running Simulation...' : 'Run Simulation'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;