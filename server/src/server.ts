import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

// Create an instance of express
const app = express();
const PORT = process.env.PORT || 3001;


// Serve static files of entire client dist folder
// app.use(express.static('/Users/matthewmendez/bootcamp/Assignments/weather-dashboard-application/client/dist'));
app.use(express.static('../client/dist'));
// Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Implemented middleware for error handling messages by Kenneth
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     console.error('Error occurred:', err.message); // Log the error message to the console
//     res.status(500).json({ error: 'Internal Server Error' }); // Respond with a 500 status
//   });
// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => {
    console.log(`Server running at http://localhost: ${PORT}`);
});
