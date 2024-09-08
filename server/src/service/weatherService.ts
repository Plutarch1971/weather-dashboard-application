import dotenv from 'dotenv';
import e from 'express';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}
// TODO: Define a class for the Weather object
export class Weather {
  private city: string;
  private temperature: number;
  private humidity: number;
  
  constructor(city: string, temperature: number, humidity: number) {
    this.city = city;
    this.temperature = temperature;
    this.humidity = humidity;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;
  private query: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org';
    this.query= "api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}";
    this.apiKey = "7d95713511593afcc21be381d93af518";
    this.cityName = '';
  }

  // TODO: Create fetchLocationData method
  public fetchLocationData = async (query: string) => {
    try{
      const response = await fetch(query);
      if (!response.ok) {
        console.log('Failed to fetch location data');
      }else{
        const locationData = await response.json();
        return locationData;
      }
    }catch(e){
      console.error(e);

    } 
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { latitude, longitude } = locationData;
    return { latitude, longitude };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const GEOCODE_API_KEY: string = process.env.GEOCODE_API_KEY || '';
    const GEOCODE: string = process.env.GEOCODE || '';
    return ''; // Add a return statement here
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { latitude, longitude } = coordinates;
    return `${this.baseURL}/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    if (!response.ok) {
      console.log('Failed to fetch weather data');
    } else {
      const weatherData = await response.json();
      return weatherData;
    }
  }
  // TODO: Build parseCurrentWeather method
   private parseCurrentWeather(response: any) {
    const { name } = response;
    const { temp, humidity } = response.main;
    return new Weather(name, temp, humidity);
   }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray: Weather[] = [currentWeather];
    for (let i = 1; i < 6; i++) {
      const { temp, humidity } = weatherData.daily[i];
      forecastArray.push(new Weather(this.cityName, temp, humidity));
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  private async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData.current);
    return this.buildForecastArray(currentWeather, weatherData);
  }
}

export default new WeatherService();
