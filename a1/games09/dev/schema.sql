drop table appuser cascade;

create table appuser (
	userid varchar(50) primary key,
	password varchar(50) NOT NULL, 
	email varchar(100) NOT NULL,
	gender varchar(10) NOT NULL,
	favourite varchar(20) NOT NULL,
	guesssolved int,
	rpssolved int,
	frogssolved int
);

insert into appuser values('auser', 'apassword');
