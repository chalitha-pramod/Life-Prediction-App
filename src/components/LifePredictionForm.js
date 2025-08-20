import React, { useState } from 'react';
import './LifePredictionForm.css';

const LifePredictionForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    country: 'USA',
    gender: '',
    height: '',
    weight: '',
    age: '',
    smoking: 'never',
    alcoholConsumption: 'none',
    diseases: []
  });

  const [diseaseInput, setDiseaseInput] = useState({
    name: '',
    severity: 'mild'
  });

  // List of countries with their WHO regions
  const countries = [
    { code: 'USA', name: 'United States', region: 'Americas' },
    { code: 'GBR', name: 'United Kingdom', region: 'Europe' },
    { code: 'CAN', name: 'Canada', region: 'Americas' },
    { code: 'AUS', name: 'Australia', region: 'Western Pacific' },
    { code: 'DEU', name: 'Germany', region: 'Europe' },
    { code: 'FRA', name: 'France', region: 'Europe' },
    { code: 'ITA', name: 'Italy', region: 'Europe' },
    { code: 'ESP', name: 'Spain', region: 'Europe' },
    { code: 'JPN', name: 'Japan', region: 'Western Pacific' },
    { code: 'CHN', name: 'China', region: 'Western Pacific' },
    { code: 'IND', name: 'India', region: 'South-East Asia' },
    { code: 'BRA', name: 'Brazil', region: 'Americas' },
    { code: 'RUS', name: 'Russia', region: 'Europe' },
    { code: 'MEX', name: 'Mexico', region: 'Americas' },
    { code: 'ZAF', name: 'South Africa', region: 'Africa' },
    { code: 'EGY', name: 'Egypt', region: 'Eastern Mediterranean' },
    { code: 'NGA', name: 'Nigeria', region: 'Africa' },
    { code: 'TUR', name: 'Turkey', region: 'Europe' },
    { code: 'IRN', name: 'Iran', region: 'Eastern Mediterranean' },
    { code: 'THA', name: 'Thailand', region: 'South-East Asia' },
    { code: 'LKA', name: 'Sri Lanka', region: 'South-East Asia' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDiseaseAdd = () => {
    if (diseaseInput.name.trim()) {
      setFormData(prev => ({
        ...prev,
        diseases: [...prev.diseases, { ...diseaseInput }]
      }));
      setDiseaseInput({ name: '', severity: 'mild' });
    }
  };

  const handleDiseaseRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      diseases: prev.diseases.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.country || !formData.gender || !formData.height || !formData.weight || !formData.age) {
      alert('Please fill in all required fields');
      return;
    }

    // Convert numeric fields
    const processedData = {
      ...formData,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      age: parseInt(formData.age)
    };

    onSubmit(processedData);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">❤️ Life Expectancy Prediction</h2>
        <p className="form-subtitle">Enter your health information to get a personalized prediction</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="section-title">Location & Demographics</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Country *</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.region})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Age (years) *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., 30"
                min="1"
                max="120"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Physical Measurements</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Height (cm) *</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., 175"
                min="100"
                max="250"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Weight (kg) *</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., 70"
                min="30"
                max="300"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section lifestyle-factors-section">
          <h3 className="section-title">Lifestyle Factors</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Smoking Status</label>
              <select
                name="smoking"
                value={formData.smoking}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="never">Never Smoked</option>
                <option value="former">Former Smoker</option>
                <option value="light">Light Smoker (1-10 cigarettes/day)</option>
                <option value="moderate">Moderate Smoker (11-20 cigarettes/day)</option>
                <option value="heavy">Heavy Smoker (20+ cigarettes/day)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Alcohol Consumption</label>
              <select
                name="alcoholConsumption"
                value={formData.alcoholConsumption}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="none">None</option>
                <option value="light">Light (1-2 drinks/week)</option>
                <option value="moderate">Moderate (3-7 drinks/week)</option>
                <option value="heavy">Heavy (8+ drinks/week)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Health Conditions</h3>
          <div className="disease-input-group">
            <input
              type="text"
              value={diseaseInput.name}
              onChange={(e) => setDiseaseInput(prev => ({ ...prev, name: e.target.value }))}
              className="form-input"
              placeholder="Disease or condition name"
            />
            <select
              value={diseaseInput.severity}
              onChange={(e) => setDiseaseInput(prev => ({ ...prev, severity: e.target.value }))}
              className="form-select"
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
            <button
              type="button"
              onClick={handleDiseaseAdd}
              className="add-disease-btn"
            >
              Add
            </button>
          </div>

          {formData.diseases.length > 0 && (
            <div className="diseases-list">
              {formData.diseases.map((disease, index) => (
                <div key={index} className="disease-item">
                  <span className="disease-name">{disease.name}</span>
                  <span className="disease-severity">{disease.severity}</span>
                  <button
                    type="button"
                    onClick={() => handleDiseaseRemove(index)}
                    className="remove-disease-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-content">
                <span className="spinner"></span>
                Calculating...
              </span>
            ) : (
              'Predict Life Expectancy'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LifePredictionForm;
