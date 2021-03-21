drop table appuser cascade;

create table appuser (
	userid varchar(50) primary key,
	password varchar(50)
);

insert into appuser values('auser', 'apassword');

