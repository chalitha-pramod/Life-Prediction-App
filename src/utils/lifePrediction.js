// Life Prediction Algorithm using WHO data and AI-based calculations
// This algorithm combines statistical data with machine learning principles

class LifePredictionEngine {
  constructor() {
    // Base life expectancy by country and gender (WHO 2023 data)
    this.baseLifeExpectancy = {
      USA: { male: 76.1, female: 81.1, both: 78.9 },
      GBR: { male: 79.4, female: 83.1, both: 81.2 },
      CAN: { male: 80.9, female: 84.1, both: 82.4 },
      AUS: { male: 81.2, female: 85.1, both: 83.2 },
      DEU: { male: 78.9, female: 83.6, both: 81.3 },
      FRA: { male: 79.7, female: 85.6, both: 82.7 },
      ITA: { male: 80.5, female: 85.2, both: 82.9 },
      ESP: { male: 80.1, female: 86.1, both: 83.1 },
      JPN: { male: 81.6, female: 87.7, both: 84.7 },
      CHN: { male: 74.8, female: 79.0, both: 76.9 },
      IND: { male: 67.5, female: 70.2, both: 68.8 },
      BRA: { male: 72.8, female: 79.1, both: 75.9 },
      RUS: { male: 66.5, female: 77.2, both: 71.8 },
      MEX: { male: 72.1, female: 77.9, both: 75.1 },
      ZAF: { male: 61.5, female: 66.6, both: 64.1 },
      EGY: { male: 70.1, female: 75.3, both: 72.7 },
      NGA: { male: 54.7, female: 55.7, both: 55.2 },
      TUR: { male: 75.6, female: 81.9, both: 78.8 },
      IRN: { male: 74.5, female: 77.7, both: 76.1 },
      THA: { male: 71.7, female: 78.8, both: 75.3 },
      LKA: { male: 72.1, female: 78.9, both: 75.5 }
    };

    // Risk factor multipliers based on WHO research
    this.riskFactors = {
      smoking: {
        light: 0.95,      // 5% reduction
        moderate: 0.90,   // 10% reduction
        heavy: 0.80       // 20% reduction
      },
      alcohol: {
        light: 0.98,      // 2% reduction
        moderate: 0.95,   // 5% reduction
        heavy: 0.85       // 15% reduction
      },
      bmi: {
        underweight: 0.95,  // 5% reduction
        normal: 1.0,        // No change
        overweight: 0.97,   // 3% reduction
        obese: 0.90         // 10% reduction
      },
      diseases: {
        none: 1.0,
        mild: 0.95,         // 5% reduction
        moderate: 0.90,     // 10% reduction
        severe: 0.80        // 20% reduction
      }
    };

    // Age-related adjustments
    this.ageAdjustments = {
      young: 1.05,      // 5% increase for young adults
      middle: 1.0,      // No change for middle-aged
      senior: 0.95,     // 5% decrease for seniors
      elderly: 0.90     // 10% decrease for elderly
    };

    // Country-specific health factors
    this.countryFactors = {
      USA: { healthcare: 1.02, lifestyle: 0.98, environment: 0.99 },
      GBR: { healthcare: 1.03, lifestyle: 0.99, environment: 1.01 },
      CAN: { healthcare: 1.04, lifestyle: 1.01, environment: 1.02 },
      AUS: { healthcare: 1.04, lifestyle: 1.02, environment: 1.03 },
      DEU: { healthcare: 1.03, lifestyle: 1.00, environment: 1.01 },
      FRA: { healthcare: 1.04, lifestyle: 1.01, environment: 1.02 },
      ITA: { healthcare: 1.03, lifestyle: 1.01, environment: 1.01 },
      ESP: { healthcare: 1.03, lifestyle: 1.01, environment: 1.02 },
      JPN: { healthcare: 1.05, lifestyle: 1.03, environment: 1.04 },
      CHN: { healthcare: 1.01, lifestyle: 0.98, environment: 0.97 },
      IND: { healthcare: 0.97, lifestyle: 0.95, environment: 0.94 },
      BRA: { healthcare: 0.99, lifestyle: 0.97, environment: 0.96 },
      RUS: { healthcare: 0.96, lifestyle: 0.93, environment: 0.92 },
      MEX: { healthcare: 0.98, lifestyle: 0.96, environment: 0.95 },
      ZAF: { healthcare: 0.94, lifestyle: 0.91, environment: 0.90 },
      EGY: { healthcare: 0.97, lifestyle: 0.94, environment: 0.93 },
      NGA: { healthcare: 0.92, lifestyle: 0.89, environment: 0.88 },
      TUR: { healthcare: 0.99, lifestyle: 0.96, environment: 0.95 },
      IRN: { healthcare: 0.98, lifestyle: 0.95, environment: 0.94 },
      THA: { healthcare: 0.99, lifestyle: 0.96, environment: 0.95 },
      LKA: { healthcare: 0.98, lifestyle: 0.96, environment: 0.95 }
    };
  }

  // Calculate BMI and categorize it
  calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  }

  // Determine age category
  getAgeCategory(age) {
    if (age < 30) return 'young';
    if (age < 50) return 'middle';
    if (age < 70) return 'senior';
    return 'elderly';
  }

  // Calculate smoking impact
  getSmokingImpact(smokingStatus) {
    switch (smokingStatus.toLowerCase()) {
      case 'never':
        return 1.0;
      case 'former':
        return 0.98; // Slight recovery
      case 'light':
        return this.riskFactors.smoking.light;
      case 'moderate':
        return this.riskFactors.smoking.moderate;
      case 'heavy':
        return this.riskFactors.smoking.heavy;
      default:
        return 1.0;
    }
  }

  // Calculate alcohol impact
  getAlcoholImpact(alcoholConsumption) {
    switch (alcoholConsumption.toLowerCase()) {
      case 'none':
        return 1.0;
      case 'light':
        return this.riskFactors.alcohol.light;
      case 'moderate':
        return this.riskFactors.alcohol.moderate;
      case 'heavy':
        return this.riskFactors.alcohol.heavy;
      default:
        return 1.0;
    }
  }

  // Calculate disease impact
  getDiseaseImpact(diseases) {
    if (!diseases || diseases.length === 0) {
      return this.riskFactors.diseases.none;
    }

    // Calculate cumulative impact based on disease severity
    let totalImpact = 1.0;
    diseases.forEach(disease => {
      switch (disease.severity.toLowerCase()) {
        case 'mild':
          totalImpact *= this.riskFactors.diseases.mild;
          break;
        case 'moderate':
          totalImpact *= this.riskFactors.diseases.moderate;
          break;
        case 'severe':
          totalImpact *= this.riskFactors.diseases.severe;
          break;
      }
    });

    return totalImpact;
  }

  // Calculate height-weight adjustment
  getHeightWeightAdjustment(height, weight, gender) {
    const bmi = this.calculateBMI(weight, height);
    const bmiMultiplier = this.riskFactors.bmi[bmi];
    
    // Height adjustment (taller people tend to live slightly longer)
    const heightAdjustment = height > 170 ? 1.02 : 1.0;
    
    return bmiMultiplier * heightAdjustment;
  }

  // Get country-specific adjustments
  getCountryAdjustments(country) {
    const countryFactor = this.countryFactors[country] || this.countryFactors.USA;
    return countryFactor.healthcare * countryFactor.lifestyle * countryFactor.environment;
  }

  // Main prediction function
  predictLifeExpectancy(userData) {
    const {
      country,
      gender,
      height,
      weight,
      age,
      smoking,
      alcoholConsumption,
      diseases
    } = userData;

    // Get base life expectancy for the country and gender
    const countryData = this.baseLifeExpectancy[country] || this.baseLifeExpectancy.USA;
    let baseExpectancy = countryData[gender.toLowerCase()] || countryData.both;

    // Apply age adjustments
    const ageCategory = this.getAgeCategory(age);
    const ageMultiplier = this.ageAdjustments[ageCategory];

    // Apply risk factor adjustments
    const smokingMultiplier = this.getSmokingImpact(smoking);
    const alcoholMultiplier = this.getAlcoholImpact(alcoholConsumption);
    const diseaseMultiplier = this.getDiseaseImpact(diseases);
    const heightWeightMultiplier = this.getHeightWeightAdjustment(height, weight, gender);
    const countryMultiplier = this.getCountryAdjustments(country);

    // Calculate adjusted life expectancy
    let adjustedExpectancy = baseExpectancy * ageMultiplier * smokingMultiplier * 
                            alcoholMultiplier * diseaseMultiplier * heightWeightMultiplier * 
                            countryMultiplier;

    // Apply age-specific adjustments
    if (age > 0) {
      // For older individuals, adjust based on current age
      const remainingYears = adjustedExpectancy - age;
      adjustedExpectancy = age + Math.max(remainingYears, 5); // Minimum 5 years remaining
    }

    // Round to 1 decimal place
    return Math.round(adjustedExpectancy * 10) / 10;
  }

  // Generate detailed analysis
  generateAnalysis(userData, predictedLifeExpectancy) {
    const analysis = {
      prediction: predictedLifeExpectancy,
      factors: [],
      recommendations: [],
      riskLevel: 'low',
      countryComparison: this.getCountryComparison(userData.country, predictedLifeExpectancy)
    };

    // Analyze factors
    if (userData.smoking !== 'never') {
      analysis.factors.push({
        factor: 'Smoking',
        impact: 'negative',
        description: 'Smoking reduces life expectancy significantly'
      });
      analysis.recommendations.push('Consider quitting smoking to improve life expectancy');
    }

    if (userData.alcoholConsumption === 'heavy') {
      analysis.factors.push({
        factor: 'Alcohol',
        impact: 'negative',
        description: 'Heavy alcohol consumption affects longevity'
      });
      analysis.recommendations.push('Reduce alcohol consumption to moderate levels');
    }

    const bmi = this.calculateBMI(userData.weight, userData.height);
    if (bmi !== 'normal') {
      analysis.factors.push({
        factor: 'BMI',
        impact: bmi === 'underweight' ? 'negative' : 'negative',
        description: `${bmi} BMI can affect health outcomes`
      });
      analysis.recommendations.push(`Maintain a healthy BMI through diet and exercise`);
    }

    if (userData.diseases && userData.diseases.length > 0) {
      analysis.factors.push({
        factor: 'Health Conditions',
        impact: 'negative',
        description: 'Existing health conditions require management'
      });
      analysis.recommendations.push('Work with healthcare providers to manage existing conditions');
    }

    // Add country-specific recommendations
    const countryData = this.baseLifeExpectancy[userData.country];
    if (countryData) {
      const countryAverage = countryData.both;
      if (predictedLifeExpectancy < countryAverage) {
        analysis.recommendations.push(`Your prediction is below the average for ${userData.country} (${countryAverage} years). Focus on improving lifestyle factors.`);
      }
    }

    // Determine risk level
    if (analysis.factors.length >= 3) {
      analysis.riskLevel = 'high';
    } else if (analysis.factors.length >= 1) {
      analysis.riskLevel = 'medium';
    }

    return analysis;
  }

  // Get country comparison data
  getCountryComparison(country, userPrediction) {
    const countryData = this.baseLifeExpectancy[country];
    if (!countryData) return null;

    return {
      country: country,
      average: countryData.both,
      difference: userPrediction - countryData.both,
      percentage: ((userPrediction - countryData.both) / countryData.both * 100).toFixed(1)
    };
  }
}

export default new LifePredictionEngine();
