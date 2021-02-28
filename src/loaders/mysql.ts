import { Db } from 'mysql';
import config from '../config';
import mysql from 'mysql';

export default  (): Promise<Db> => {
  return new Promise(async(resolve,reject)=>{
    try{
      const connection = await mysql.createConnection({
        host: config.databaseHost,
        user: config.databaseUser,
        password: config.databasePassword
      });
      
      connection.connect(async function(err) {
        if (err) throw err;
        await connection.query(`CREATE DATABASE IF NOT EXISTS LOUNGE_DB;`);
        await connection.query('use LOUNGE_DB;')
        let userTable = `create table if not exists user(
          id int primary key auto_increment,
          email varchar(255)not null,
          name varchar(255)not null,
          password varchar(255)not null
      )`;
      connection.query(userTable, function(err, results, fields) {
        if (err) {
          console.log(err.message);
        }
      });
       resolve(connection);
      });
    }catch(e){

    }
  })
  
};
