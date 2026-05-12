import express from 'express';
import Health from './routes/health';
import helmet from 'helmet';
import cors from 'cors';

const api = express();

api.use(
  cors({
    origin: '*',
  }),
);
api.use(helmet({}));
api.use(express.json());
api.use(express.urlencoded({ extended: true }));

api.get('/health', Health);

export { api };