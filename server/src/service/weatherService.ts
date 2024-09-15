import dotenv from 'dotenv';
import e from 'express';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
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
  private API_key: string;
  private cityName: string;
  private query: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org';
    this.query = 'apiUrl';
    this.API_key = process.env.API_KEY || '';
    this.cityName = '';
  }

  // TODO: Create fetchLocationData method
  public fetchLocationData = async (query: string) => {
    console.log('query: ', query);
    try{
      const response = await fetch(query);
      console.log('response: ', response);
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
    console.log('locationData: ', locationData);
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
  
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.API_key}`; // Add a return statement here
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    console.log('coordinates: ', coordinates);
    const { lat, lon } = coordinates;
    return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.API_key}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    return await this.fetchLocationData(this.buildGeocodeQuery()).then((locationData)=> this.destructureLocationData(locationData));
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    console.log('this.buildWeatherQuery(coordinates): ', this.buildWeatherQuery(coordinates));
    const response = await fetch(this.buildWeatherQuery(coordinates));
    if (!response.ok) {
      console.log('Failed to fetch weather data');
    } else {
      const weatherData = await response.json();
      console.log('weatherData: ', weatherData);
      return weatherData;
    }
  }
  // TODO: Build parseCurrentWeather method
   private parseCurrentWeather(response: any) {
    const { temp, humidity } = response.list[0].main;
    return new Weather(this.cityName, temp, humidity);
   }
  // TODO: Complete buildForecastArray method
  public buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    console.log('weatherData: ', weatherData);
    console.log('currentWeather: ', currentWeather);
    const forecastArray: Weather[] = [currentWeather];
    for (let i = 1; i < 6; i++) {  
      //check the time on each of the weatherData objects
      //only push the ones that are at 12:00. parse with day.js
      const { temp, humidity } = weatherData[i];
      forecastArray.push(new Weather(this.cityName, temp, humidity));
    }
    return forecastArray;
  }
  
  // TODO: Complete getWeatherForCity method
  public async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    return this.buildForecastArray(currentWeather, weatherData.list);
  }
}

export default new WeatherService();
