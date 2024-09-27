import { Router,type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  console.log('req.body: ', req.body);
  try {
    const city = req.body.city;
    console.log('cityName: ', city);
    
    // TODO: GET weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(city);
    console.log('weatherData: ', weatherData);
    // TODO: save city to search history
    HistoryService.addCity(city);
    
    res.status(200).json(weatherData);
  } catch (error) {
    console.error(error);
    console.log('error: ', error);
    res.status(500).json({ message: 'Internal server error' });
    
  }
});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    if (req.query.clear) {
    const history = await HistoryService.getHistory();
    res.status(200).json(history);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const cityId = req.params.id;
    await HistoryService.removeCity(cityId);
    res.status(200).json({ message: 'City deleted from history' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
