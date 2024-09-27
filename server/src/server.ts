import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

// Create an instance of express
const app = express();
const PORT = process.env.PORT || 3003;


// Serve static files of entire client dist folder
app.use(express.static('../client/dist'));

// Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => {
    console.log(`Server running at http://localhost: ${PORT}`);
});
