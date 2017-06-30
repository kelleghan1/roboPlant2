DROP DATABASE IF EXISTS robodb;
CREATE DATABASE robodb;

CREATE TABLE testingtable (ID SERIAL PRIMARY KEY,name VARCHAR,breed VARCHAR,age INTEGER,sex VARCHAR);

INSERT INTO testingtable (name, breed, age, sex) VALUES ('Tyler', 'Retrieved', 3, 'M');
INSERT INTO clients (name, breed, age, sex) VALUES ('Coleman', 'Retrieved', 3, 'M');
INSERT INTO clients (name, breed, age, sex) VALUES ('Joel', 'Retrieved', 3, 'M');
INSERT INTO clients (name, breed, age, sex) VALUES ('Blah', 'Retrieved', 3, 'M');
