import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';

const server = express();

let cachedApp;

export const bootstrap = async (expressInstance) => {
  if (!cachedApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressInstance),
    );
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.enableCors();
    await app.init();
    cachedApp = app;
  }
  return cachedApp;
};

export default async function handler(req, res) {
  await bootstrap(server);
  server(req, res);
}
