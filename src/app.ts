import { Logger } from 'winston';
import { config } from '@notifications/config';
import express, { Express } from 'express';
import { start } from '@notifications/server';
import { winstonLogger } from '@flowercordoba/task-shared-library';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationApp', 'debug');

function initialize(): void {
  const app: Express = express();
  start(app);
  log.info('Notification Service Initialized');
}
initialize();
