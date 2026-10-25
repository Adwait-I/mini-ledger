import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

export const createApp = (): Application => {
  const app = express();

  // Standard middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes mount
  app.use('/api', routes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};

export const app = createApp();
