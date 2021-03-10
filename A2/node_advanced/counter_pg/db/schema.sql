--- load with 
--- psql "dbname='webdb' user='webdbuser' password='password' host='localhost'" -f schema.sql

DROP TABLE counter;
CREATE TABLE counter (
	counterName VARCHAR(20) PRIMARY KEY,
	counterValue INTEGER DEFAULT 0
);
