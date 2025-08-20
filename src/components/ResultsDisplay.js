import React from 'react';
import './ResultsDisplay.css';

const ResultsDisplay = ({ results, userData, onReset }) => {
  if (!results) return null;

  const { prediction, factors, recommendations, riskLevel, countryComparison } = results;
  const bmi = calculateBMI(userData.weight, userData.height);

  function calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  }

  function getRiskLevelColor(level) {
    switch (level) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#dc3545';
      default: return '#6c757d';
    }
  }

  function getRiskLevelText(level) {
    switch (level) {
      case 'low': return 'Low Risk';
      case 'medium': return 'Medium Risk';
      case 'high': return 'High Risk';
      default: return 'Unknown';
    }
  }

  function getCountryName(code) {
    const countries = {
      'USA': 'United States',
      'GBR': 'United Kingdom',
      'CAN': 'Canada',
      'AUS': 'Australia',
      'DEU': 'Germany',
      'FRA': 'France',
      'ITA': 'Italy',
      'ESP': 'Spain',
      'JPN': 'Japan',
      'CHN': 'China',
      'IND': 'India',
      'BRA': 'Brazil',
      'RUS': 'Russia',
      'MEX': 'Mexico',
      'ZAF': 'South Africa',
      'EGY': 'Egypt',
      'NGA': 'Nigeria',
      'TUR': 'Turkey',
      'IRN': 'Iran',
      'THA': 'Thailand',
      'LKA': 'Sri Lanka'
    };
    return countries[code] || code;
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h2 className="results-title">❤️ Your Life Expectancy Prediction</h2>
        <p className="results-subtitle">Based on WHO data and AI analysis</p>
      </div>
      
      <div className="prediction-section">
        <div className="life-expectancy">
          {prediction} years
        </div>
        <div className="country-info">
          <span className="country-flag">🌍</span>
          <span className="country-name">{getCountryName(userData.country)}</span>
        </div>
      </div>

      {countryComparison && (
        <div className="country-comparison">
          <div className="comparison-card">
            <div className="comparison-item">
              <span className="comparison-label">Your Prediction</span>
              <span className="comparison-value">{prediction} years</span>
            </div>
            <div className="comparison-item">
              <span className="comparison-label">Country Average</span>
              <span className="comparison-value">{countryComparison.average} years</span>
            </div>
            <div className="comparison-item">
              <span className="comparison-label">Difference</span>
              <span className={`comparison-value ${countryComparison.difference >= 0 ? 'positive' : 'negative'}`}>
                {countryComparison.difference >= 0 ? '+' : ''}{countryComparison.difference.toFixed(1)} years
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="user-summary">
        <h3 className="summary-title">Your Profile Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Country</span>
            <span className="summary-value">{getCountryName(userData.country)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Age</span>
            <span className="summary-value">{userData.age} years</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Gender</span>
            <span className="summary-value">{userData.gender}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Height</span>
            <span className="summary-value">{userData.height} cm</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Weight</span>
            <span className="summary-value">{userData.weight} kg</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">BMI</span>
            <span className="summary-value">{bmi}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Risk Level</span>
            <span 
              className="summary-value risk-level"
              style={{ color: getRiskLevelColor(riskLevel) }}
            >
              {getRiskLevelText(riskLevel)}
            </span>
          </div>
        </div>
      </div>

      {factors.length > 0 && (
        <div className="factors-section">
          <h3 className="section-title">Key Factors Affecting Your Prediction</h3>
          <div className="factors-grid">
            {factors.map((factor, index) => (
              <div key={index} className="factor-card">
                <div className="factor-header">
                  <div className="factor-title">{factor.factor}</div>
                  <div className={`factor-impact ${factor.impact}`}>
                    {factor.impact === 'negative' ? '↓' : '↑'} Impact
                  </div>
                </div>
                <div className="factor-description">{factor.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <h3 className="section-title">Recommendations to Improve Life Expectancy</h3>
          <div className="recommendations-list">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="recommendation-item">
                <span className="recommendation-icon">💡</span>
                <span className="recommendation-text">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="data-source">
        <div className="data-source-header">
          <span className="data-icon">📊</span>
          <h4>Data Sources & Disclaimer</h4>
        </div>
        <p>
          <strong>Data Source:</strong> This prediction is based on data from the World Health Organization (WHO) 
          Global Health Observatory and statistical models incorporating multiple health risk factors.
        </p>
        <p>
          <strong>Disclaimer:</strong> This is an educational tool and should not replace professional medical advice. 
          Individual results may vary based on many factors not captured in this model.
        </p>
      </div>

      <div className="results-actions">
        <button onClick={onReset} className="reset-btn">
          Calculate New Prediction
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
