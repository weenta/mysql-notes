create table dd(
	id int(6) unsigned zerofill not null auto_increment,
	sname varchar(20),
	sgender enum ('男','女','保密'),
	primary key(id)
)ENGINE=MYISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;