


// need to run these queries once before project for mysql setup

 `CREATE DATABASE IF NOT EXISTS LOUNGE_DB;`;
  'use LOUNGE_DB;';
  `create table if not exists user(
    id int primary key auto_increment,
    email varchar(255)not null,
    name varchar(255)not null,
    password varchar(255)not null
    );`;
  `create table if not exists product(
    id int primary key auto_increment,
    name  varchar(255)not null,
    description  varchar(255)not null,
    size  varchar(255)not null,
    width  varchar(255)not null,
    length  varchar(255)not null,
    height  varchar(255)not null,
    quantity int not null,
    discount_percentage int not null,
    price  int not null
  );`;
  `create table if not exists checkout(
    id int primary key auto_increment,
    user_id int not null,
    product_id int not null,
    discount_percentage int not null,
    bill int not null,
    address varchar(255)not null,
    country varchar(255)not null,
    quantity int not null,
    payment_method  varchar(255)not null,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
  );`;