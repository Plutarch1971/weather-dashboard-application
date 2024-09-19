import dayjs, { Dayjs } from 'dayjs';
import dotenv from 'dotenv';
import e from 'express';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
//Define an interface for the Weather object
interface IWeather {
  city : string;
  date : Dayjs | string; //You can use Dayjs or just a string, delete it if you do not need
  tempF : number;
  windSpeed : number; //respose.wind.speed
  humidity : number;//response.main.humidity?
  icon : string; //response.weather[0].icon?
  iconDescription : string; //response.weather[0].description?
}
// TODO: Define a class for the Weather object
class Weather implements IWeather {
  constructor(
     public city: string,
     public date: Dayjs | string,
     public tempF: number,
     public windSpeed: number,
     public  humidity: number,
     public icon: string,
     public iconDescription: string
  ) {
    this.city = city;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
  }
}
// Define an interface for the WeatherService object
interface IWeatherService {
  getWeatherForCity(city: string) : Weather[];//This is an async function that should return an array of Weather objects
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private API_key: string;
  private city: string;
  
    constructor() {
    this.baseURL = 'https://api.openweathermap.org';
    this.API_key = process.env.API_KEY || '';
    this.city = '';
  }

  // TODO: Create fetchLocationData method
  public fetchLocationData = async (query: string) => {
    console.log('query: ', query);
    try{
      const response = await fetch(query);
      console.log('response: ', response);
      if (!response) {
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
  
    return `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.API_key}`; // Add a return statement here
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
    if (!response) {
      console.log('Failed to fetch weather data');
    } else {
      const weatherData = await response.json();
      console.log('weatherData: ', weatherData);
      return weatherData;
    }
  }
  // TODO: Build parseCurrentWeather method
   private parseCurrentWeather(response: any) {
    const { city, date, tempF, windSpeed, humidity, icon, iconDescription } = response.list[0].main;
    return new Weather(city, date, tempF, windSpeed, humidity, icon, iconDescription);
   }
  // TODO: Complete buildForecastArray method
  public buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    console.log ("BuildForecastArray");
    console.log('weatherData: ', weatherData);
    console.log('currentWeather: ', currentWeather);
    const forecastArray: Weather[] = [currentWeather];
    for (let i = 0; i < 6; i++) {  
      // Check the time on each of the weatherData objects
      const date = dayjs(weatherData[i].dt_txt).format('MM/DD/YYYY');
      const formattedTime = dayjs(weatherData[i].dt_txt).format('HH:mm:ss');

      if (formattedTime === "12:00:00") {
        const { main: { temp }, wind: { speed }, main: { humidity }, weather } = weatherData[i];
        const tempF = (temp - 273.15) * 9/5 + 32; // Convert Kelvin to Fahrenheit
        const icon = weather[0].icon;
        const iconDescription = weather[0].description;
        forecastArray.push(new Weather(this.city, date, tempF, speed, humidity, icon, iconDescription));
      }
      
      //const { city, date, tempF, windSpeed, humidity, icon, iconDescription } = weatherData[i];
      //forecastArray.push(new Weather(city, date, tempF, windSpeed, humidity, icon, iconDescription));
    }
    return forecastArray;
  }
  
  // TODO: Complete getWeatherForCity method
  public async getWeatherForCity(city: string) {
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    return this.buildForecastArray(currentWeather, weatherData.list);
  }
}

export default new WeatherService();
