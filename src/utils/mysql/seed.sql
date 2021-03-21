


// need to write mysql creation queries here

 await connection.query(`CREATE DATABASE IF NOT EXISTS LOUNGE_DB;`);
        await connection.query('use LOUNGE_DB;')
        let userTable = `create table if not exists user(
          id int primary key auto_increment,
          email varchar(255)not null,
          name varchar(255)not null,
          password varchar(255)not null
          )`;