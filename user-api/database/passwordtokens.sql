create table passwordtokens(
	id int auto_increment primary key,
  token varchar(200) not null,
  user_id int not null,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE cascade
);
alter table passwordtokens add column used tinyint not null;