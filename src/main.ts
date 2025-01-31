import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { timeout } from 'rxjs';

// Protection agains brute force atack
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many requests try again later.',
});

// auth limiter
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // limit each IP to 5 failed attempts per hour
  message: 'Too many failed attempts, please try again later',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // RATE LIMITER
  app.use('/auth', authLimiter);
  app.use('/users', limiter);
  app.use('/bars', limiter);
  app.use('/reviews', limiter);
  app.use('/favorites', limiter);
  app.use(timeout(15000));
  // HELMET
  app.use(helmet());
  // CORS CONFIGURUTION
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    maxAge: 3600
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
