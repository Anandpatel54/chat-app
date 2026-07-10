import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import passport from 'passport';
import corsOptions from './config/cors';
import { generalLimiter } from './middlewares/rateLimiter.middleware';
import errorMiddleware from './middlewares/error.middleware';
import routes from './routes';
import configurePassport from './config/passport';
import configureCloudinary from './config/cloudinary';
import configureFirebase from './config/firebase';

const app = express();

// Security
app.use(helmet());
app.use(cors(corsOptions));
app.use(mongoSanitize());
app.use(generalLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Passport
configurePassport();
app.use(passport.initialize());

// Cloudinary
configureCloudinary();

// Firebase
configureFirebase();

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Route not found',
  });
});

// Central error handler
app.use(errorMiddleware);

export default app;
