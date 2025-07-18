import 'reflect-metadata';
import express, { Application, NextFunction, Request, Response } from 'express';
import chalk from 'chalk';
import cors from 'cors';
import dotenv from 'dotenv';
import { expressjwt } from 'express-jwt';
import fs from 'fs';
import helmet from 'helmet';
import mongoose from 'mongoose';
import path from 'path';
import { generateHTML, serve } from 'swagger-ui-express';
import ErrorMiddleware from './middlewares/error.middleware';
import NotFoundMiddleware from './middlewares/not-found.middleware';
import HttpException from './utils/exceptions/http.exception';
import { RegisterRoutes } from './routes/routes';
import Api from './constants/api.constant';
import HttpCode from './constants/http-code.constant';

class App {
  public app: Application;
  public log;
  constructor() {
    this.app = express();
    this.initialiseConfig();
    this.initialiseJWT();
    this.initialiseRoutes();
    this.initialiseSwagger();
    this.initialiseControllers();
    this.initializeMongo();
    this.initialiseErrorHandling();
  }


  private initCorsSetup() {
    let allowedOrigins = [
    ];
    if (process.env.NODE_ENV !== 'production') {
      const localOrigins = [
        'http://localhost',
        'http://localhost:4200',
        'https://localhost:4200',
        'http://[::]:4200',
        'https://[::]:4200',
        'https://localhost',
        'http://localhost:5173', // Vite dev
        'http://localhost:8080', // Docker frontend
      ];
      allowedOrigins = allowedOrigins.concat(localOrigins);
    }

    const corsOptions = {
      exposedHeaders: 'Authorization',
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.log(origin);
          callback(new Error('Origin not allowed by CORS'));
        }
      },
    };
    this.app.use(cors(corsOptions));
  }

  private initialiseConfig(): void {
    dotenv.config();
    this.initCorsSetup();
    this.app.use(helmet());
    this.app.set('trust proxy', true);
    this.app.use(express.json({ limit: '50mb' }));
  }

  private initializeMongo() {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', async () => {
      console.log(chalk.greenBright('[MONGO] Database connected ✅.'));
      if (process.env.SEED_ON_START === 'true') {
        try {
          console.log('Running database seeder...');
          await import('./seed/seed');
          console.log('Seeder finished.');
        } catch (err) {
          console.error('Seeder failed:', err);
        }
      }
    });
  }

  private initialiseJWT() {
    this.app.use(
      expressjwt({
        secret: process.env.SECRET,
        algorithms: ['HS256'],
      }).unless({
        path: [
          /\/docs\/\w*/gi,
          `${Api.API}/docs`,
          `${Api.API}/docs/`,
          `${Api.API}/auth/token`,
          `${Api.API}/auth/register`,
        ],
      })
    );
  }

  private initialiseRoutes(): void {
    this.app.get(
      Api.ROOT,
      (_req: Request, res: Response, next: NextFunction) => {
        try {
          return res.status(HttpCode.OK).json({
            status: {
              code: HttpCode.OK,
              msg: "working",
            },
          });
        } catch (err: any) {
          return next(
            new HttpException(HttpCode.INTERNAL_SERVER_ERROR, err.message)
          );
        }
      }
    );
  }

  private initialiseControllers(): void {
    RegisterRoutes(this.app);
  }

  private initialiseErrorHandling(): void {
    this.app.use(NotFoundMiddleware);
    this.app.use(ErrorMiddleware);
  }

  private initialiseSwagger() {
    if (process.env.NODE_ENV !== 'production') {
      this.app.use(
        `${Api.API}/docs`,
        serve,
        async (_req: Request, res: Response) => {
          return res.send(generateHTML(await import('./schemas/swagger.json')));
        }
      );
    }
  }

}

export default App;
