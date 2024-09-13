import { Router,type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  console.log('req.body: ', req.body);
  try {
    const cityName = req.body.cityName;
    console.log('cityName: ', cityName);
    
    // TODO: GET weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    console.log('weatherData: ', weatherData);
    // TODO: save city to search history
    HistoryService.addCity(cityName);
    
    res.status(200).json(weatherData);
  } catch (error) {
    console.error(error);
    console.log('error: ', error);
    res.status(500).json({ message: 'Internal server error' });
    
  }
});

// TODO: GET search history
router.get('/history', async (req, res) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {});

export default router;
