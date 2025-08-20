import axios from 'axios';

// WHO Global Health Observatory (GHO) OData API endpoints
const WHO_BASE_URL = 'https://ghoapi.azureedge.net/api';

// Life expectancy data endpoint
const LIFE_EXPECTANCY_ENDPOINT = '/Indicator?$filter=IndicatorName eq "Life expectancy at birth (years)"';

// Health risk factors data
const HEALTH_RISKS_ENDPOINT = '/Indicator?$filter=IndicatorName eq "Prevalence of tobacco use among persons aged 15+ years (%)"';

class WHOApiService {
  constructor() {
    this.baseURL = WHO_BASE_URL;
  }

  // Fetch life expectancy data by country and sex
  async getLifeExpectancyData(country = 'USA', sex = 'Both sexes') {
    try {
      const response = await axios.get(`${this.baseURL}${LIFE_EXPECTANCY_ENDPOINT}&$filter=CountryName eq '${country}' and Sex eq '${sex}'`);
      return response.data.value || [];
    } catch (error) {
      console.error('Error fetching WHO life expectancy data:', error);
      throw new Error('Failed to fetch life expectancy data from WHO');
    }
  }

  // Fetch global life expectancy statistics
  async getGlobalLifeExpectancyStats() {
    try {
      const response = await axios.get(`${this.baseURL}${LIFE_EXPECTANCY_ENDPOINT}&$top=100`);
      return response.data.value || [];
    } catch (error) {
      console.error('Error fetching global WHO data:', error);
      throw new Error('Failed to fetch global life expectancy data');
    }
  }

  // Get average life expectancy by region
  async getLifeExpectancyByRegion() {
    try {
      const response = await axios.get(`${this.baseURL}${LIFE_EXPECTANCY_ENDPOINT}&$top=1000`);
      const data = response.data.value || [];
      
      // Group by region and calculate averages
      const regionData = data.reduce((acc, item) => {
        const region = item.WHORegion || 'Unknown';
        if (!acc[region]) {
          acc[region] = { count: 0, total: 0, countries: [] };
        }
        acc[region].count++;
        acc[region].total += parseFloat(item.Value) || 0;
        acc[region].countries.push({
          country: item.CountryName,
          value: parseFloat(item.Value) || 0,
          year: item.TimeDimensionValue
        });
        return acc;
      }, {});

      // Calculate averages
      Object.keys(regionData).forEach(region => {
        regionData[region].average = regionData[region].total / regionData[region].count;
      });

      return regionData;
    } catch (error) {
      console.error('Error fetching regional WHO data:', error);
      throw new Error('Failed to fetch regional life expectancy data');
    }
  }

  // Get health risk factors data
  async getHealthRiskFactors() {
    try {
      const response = await axios.get(`${this.baseURL}${HEALTH_RISKS_ENDPOINT}&$top=100`);
      return response.data.value || [];
    } catch (error) {
      console.error('Error fetching health risk factors:', error);
      throw new Error('Failed to fetch health risk factors data');
    }
  }

  // Get country-specific health data
  async getCountryHealthData(countryCode = 'USA') {
    try {
      const [lifeExpectancy, riskFactors] = await Promise.all([
        this.getLifeExpectancyData(countryCode),
        this.getHealthRiskFactors()
      ]);

      return {
        lifeExpectancy,
        riskFactors,
        country: countryCode
      };
    } catch (error) {
      console.error('Error fetching country health data:', error);
      throw new Error('Failed to fetch country health data');
    }
  }
}

export default new WHOApiService();
