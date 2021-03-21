import config from '../../config';
import mysql from 'mysql';


export default class MySQL {
  static connection: mysql.createConnection;

  static startConnection(): Promise<mysql.createConnection> {
    return new Promise(async (resolve, reject) => {
      try {
        this.connection = await mysql.createConnection({
          host: config.databaseHost,
          user: config.databaseUser,
          password: config.databasePassword,
          database: config.databaseName
        });
        this.connection.connect();
        resolve(this.connection);
      } catch (e) {
        throw new Error(e)
      }
    })
  }

  static endConnection(): Promise<mysql.createConnection> {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.connection) {
          this.connection.end();
          resolve(true);
        } else {
          throw new Error('No connection with mysql');
        }
      } catch (e) {
        throw new Error(e);
      }
    })
  }
}