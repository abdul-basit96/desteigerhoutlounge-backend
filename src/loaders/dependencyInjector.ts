import { Container } from 'typedi';
import LoggerInstance from './logger';
import { ResponseCodes, ResponseNames } from '../enums';
import Query from '../utils/mysql/query';

export default () => {
  try {
    // Container.set('mysql',mysqlInstance);
    Container.set('responseCodes', ResponseCodes);
    Container.set('responseNames', ResponseNames);
    Container.set('logger', LoggerInstance);
    Container.set('mysql', Container.get(Query));
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
