import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookiePraser from 'cookie-parser';
import {authRoutes} from './routes';

const app = express();

// App Setup
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.json({limit: '16kb'}));
app.use(express.static('public'));
app.use(cookiePraser());

// Health check
app.get('/ping', (req, res) => {
  res.status(200).json({success: true, message: 'pong'});
});

// Routes setup
app.use('/api/v1/auth', authRoutes);

export {app};
