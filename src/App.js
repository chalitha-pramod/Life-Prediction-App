import React, { useState } from 'react';
import LifePredictionForm from './components/LifePredictionForm';
import ResultsDisplay from './components/ResultsDisplay';
import GlobalStats from './components/GlobalStats';
import lifePredictionEngine from './utils/lifePrediction';
import './App.css';

function App() {
  const [results, setResults] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setUserData(formData);

    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Calculate life expectancy using our AI engine
      const predictedLifeExpectancy = lifePredictionEngine.predictLifeExpectancy(formData);
      
      // Generate detailed analysis
      const analysis = lifePredictionEngine.generateAnalysis(formData, predictedLifeExpectancy);
      
      setResults(analysis);
    } catch (error) {
      console.error('Error calculating life expectancy:', error);
      alert('An error occurred while calculating your life expectancy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setUserData(null);
    setShowStats(false);
  };

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1 className="app-title">❤️ Life Prediction App</h1>
          <p className="app-subtitle">
            Predict your life expectancy using WHO data and AI algorithms
          </p>
        </header>

        {!results ? (
          <>
            <LifePredictionForm onSubmit={handleFormSubmit} loading={loading} />
            
            <div className="stats-toggle">
              <button 
                onClick={toggleStats} 
                className="toggle-stats-btn"
              >
                {showStats ? 'Hide' : 'Show'} Global Statistics
              </button>
            </div>

            {showStats && <GlobalStats />}
          </>
        ) : (
          <ResultsDisplay 
            results={results} 
            userData={userData} 
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

export default App;
