import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const client = createClient({
  url: process.env.RATE_LIMIT_REDIS_URL,
  username: process.env.RATE_LIMIT_REDIS_USERNAME,
  password: process.env.RATE_LIMIT_REDIS_PASSWORD,
  socket: undefined,
  // ... (see https://github.com/redis/node-redis/blob/master/docs/client-configuration.md)
});

// TODO: make sure connected
client.connect();

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  limiter;

  constructor() {
    this.limiter = rateLimit({
      windowMs: 60 * 1000 * 60, // 1 hour
      // max: (req: Request, res: Response) => {},
      standardHeaders: true,
      legacyHeaders: false,
      // skip: (req: Request, res: Response) => { },
      // keyGenerator: (req: Request, res: Response) => { },
      // handler: (req: Request, res: Response, next) => {
      store: new RedisStore({
        sendCommand: (...args: string[]) => client.sendCommand(args),
      }),
    });
  }

  async use(req: Request, res: Response, next: (...args) => void) {
    try {
      this.limiter(req, res, next);
    } catch (error) {
      next(error);
    }
  }
}
