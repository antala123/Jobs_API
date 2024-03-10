import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Color from 'colors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import authrouter from './routes/authRoute.js';
import userrouter from './routes/userRoute.js';
import jobsrouter from './routes/jobsRoute.js';
import errorHandler from './Middelware/errorHandler.js';


const app = express();
dotenv.config();


// mongodb connection:
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

// Security:
app.use(helmet());
app.use(mongoSanitize());
// next security step for authRoute side:-->

app.use(express.json());
app.use(morgan("dev"));

// Route:
app.use('/api/auth', authrouter);
app.use('/api/user', userrouter);
app.use('/api/job', jobsrouter);


// Error handlers:
app.use(errorHandler);

// Port Listen:
app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on port ${process.env.APP_PORT}`.bgGreen.black);
})

