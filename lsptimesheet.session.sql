--@BLOCK 
CREATE TABLE Employees(
    id SMALLINT NOT NULL PRIMARY KEY,
    last_name varchar(255) NOT NULL,
    first_name varchar(255) NOT NULL,
    roles BOOLEAN NOT NULL 
);

--@BLOCK
CREATE TABLE Locations(
    location_name TEXT NOT NULL PRIMARY KEY,
    location_address TEXT NOT NULL,
    lat_1 FLOAT NOT NULL,
    long_1 FLOAT NOT NULL,
    lat_2 FLOAT NOT NULL,
    long_2 FLOAT NOT NULL
);

--@BLOCK 
CREATE TABLE SCHEDULE(
    id SERIAL NOT NULL,
    work_date DATE NOT NULL,
    last_name varchar(255) NOT NULL,
    first_name varchar(255) NOT NULL,
    location_name TEXT NOT NULL,
    location_address TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
)

--@BLOCK
ALTER TABLE Employees
RENAME COLUMN roles to admin;
--@BLOCK
ALTER TABLE Locations
ADD COLUMN id SERIAL;

--@BLOCK
SELECT* FROM employees ORDER BY id ASC;

--@BLOCK
SELECT* FROM locations ORDER BY location_name ASC;

--@BLOCK
SELECT* FROM schedule ORDER BY id ASC;
--@BLOCK
INSERT INTO employees (id, last_name,first_name,admin)
VALUES (2, 'hines','jay','false');
--@BLOCK
SELECT admin FROM employees WHERE id=1;

--@BLOCK
UPDATE Employees
SET Last_name = 'paker', first_name = 'peter'
WHERE id = 3671;

--@BLOCK 
DELETE FROM Employees
WHERE id = 6483;

--@BLOCK 
INSERT INTO locations (location_name, location_address, lat_1, long_1, lat_2, long_2) VALUES
('Central Park', 'New York, NY, USA', 40.785091, -73.968285, 40.784000, -73.970000),
('Eiffel Tower', 'Champ de Mars, Paris, France', 48.858844, 2.294351, 48.857500, 2.292000);

--@BLOCK 
INSERT INTO SCHEDULE (work_date ,last_name ,first_name ,location_name ,location_address ,start_time ,end_time) VALUES
('2025-01-12', 'ass','bob', 'wall mart park','New York, NY,USA','14:30:00','22:30:00'),
('2025-01-19', 'jay','hines', 'wall mart park','New York, NY,USA','14:30:00','22:30:00');
