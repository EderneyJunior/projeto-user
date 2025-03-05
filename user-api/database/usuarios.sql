create table users(
	id int auto_increment primary key,
  name varchar(50) not null,
  email varchar(150) unique not null,
  password varchar(200) not null,
  role int
);