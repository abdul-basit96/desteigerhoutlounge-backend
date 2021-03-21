


// need to run these queries once before project for mysql setup

 `CREATE DATABASE IF NOT EXISTS LOUNGE_DB;`;
  'use LOUNGE_DB;'
  `create table if not exists user(
    id int primary key auto_increment,
    email varchar(255)not null,
    name varchar(255)not null,
    password varchar(255)not null
    )`;