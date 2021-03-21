import expressLoader from './express';
import { Container } from 'typedi';
import express from 'express';
import dependencyInjectorLoader from './dependencyInjector';
// import mysqlLoader from './mysql';
import jobsLoader from './jobs';
import Logger from './logger';
//We have to import at least all the events once so they can be triggered
import './events';

export default async ({ expressApp } : { expressApp: express.Application }) => {
  // const mysqlConnection = await mysqlLoader();
  // Logger.info('✌️ DB loaded and connected!');

  /**
   * WTF is going on here?
   *
   * We are injecting the mongoose models into the DI container.
   * I know this is controversial but will provide a lot of flexibility at the time
   * of writing unit tests, just go and check how beautiful they are!
   */


  // It returns the agenda instance because it's needed in the subsequent loaders
   await dependencyInjectorLoader();
  Logger.info('✌️ Dependency Injector loaded');

  // await jobsLoader({ agenda });
  // Logger.info('✌️ Jobs loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
