drop table appuser cascade;

create table appuser (
	userid varchar(50) NOT NULL primary key,
	password varchar(50) NOT NULL,
	email varchar(100),
	gender varchar(100),
	favourite varchar(100),
	guesssolved int,
	rpssolved int,
	frogssolved int
);

insert into appuser values('auser', 'apassword', 'email not defined', 
	'gender not defined', 'favourite not defined', 0, 0, 0);
