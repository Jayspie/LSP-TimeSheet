/* Table creation section*/
--@BLOCK
CREATE TABLE Employees(
    id smallint NOT NULL PRIMARY KEY,
    last_name varchar(255) NOT NULL,
    first_name varchar(255) NOT NULL,
    roles boolean NOT NULL
);

--@BLOCK
CREATE TABLE Locations(
    location_name text NOT NULL PRIMARY KEY,
    location_address text NOT NULL,
    lat_1 float NOT NULL,
    long_1 float NOT NULL,
    lat_2 float NOT NULL,
    long_2 float NOT NULL
);

--@BLOCK
CREATE TABLE SCHEDULE(
    id serial NOT NULL,
    work_date date NOT NULL,
    last_name varchar(255) NOT NULL,
    first_name varchar(255) NOT NULL,
    location_name text NOT NULL,
    location_address text NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL
);

--@BLOCK
CREATE TABLE TIMESHEET(
    employees_ID smallint NOT NULL,
    last_name varchar(255) NOT NULL,
    first_name varchar(255) NOT NULL,
    location_name text NOT NULL,
    clock_in timestamp NOT NULL,
    clock_out timestamp,
    total_hours smallint
);

--@BLOCK
CREATE TABLE ADMIN(
    admin_id smallint NOT NULL PRIMARY KEY,
    admin_name varchar(255) NOT NULL,
    password varchar(255) NOT NULL
);


/*Alter table Section */
--@BLOCK
ALTER TABLE Employees RENAME COLUMN roles TO admin;

--@BLOCK
ALTER TABLE TIMESHEET
    ALTER COLUMN clock_in TYPE timestamptz;

--@BLOCK
ALTER TABLE Locations
    ADD COLUMN id serial;

--@BLOCK
ALTER TABLE SCHEDULE
    ALTER COLUMN end_time TYPE timestamptz
    USING (work_date + end_time)::timestamptz;


/* basic Select table Section */
--@BLOCK
SELECT
    *
FROM
    employees
ORDER BY
    id ASC;

--@BLOCK
SELECT
    *
FROM
    locations
ORDER BY
    location_name ASC;

--@BLOCK
SELECT
    *
FROM
    schedule
WHERE
    last_name = 'Swift';

--@BLOCK
SELECT
    *
FROM
    ADMIN;


/*Selection with where table Section */
--@BLOCK
SELECT
    *
FROM
    TIMESHEET
WHERE
    employees_ID = 2;

--@BLOCK
SELECT
    *
FROM
    TIMESHEET
WHERE
    clock_out IS NULL
ORDER BY
    clock_in DESC;

--@BLOCK
SELECT
    admin
FROM
    employees
WHERE
    id = 1;

--@BLOCK
SELECT
    *
FROM
    SCHEDULE;

--@BLOCK
SELECT
    work_date,
    start_time,
    end_time
FROM
    SCHEDULE
WHERE
    last_name = 'MayWester'
    AND first_name = 'Nigel';

--@BLOCK
SELECT
    *
FROM
    locations
WHERE
    location_name = 'Central Park';

--@Block
SELECT
    *
FROM
    TIMESHEET
WHERE
    employees_id = 6379
ORDER BY
    clock_in DESC;

--@Block
SELECT
    location_address
FROM
    Locations
WHERE
    location_name = 'test';


/*Update table Section*/
--@BLOCK
UPDATE
    Employees
SET
    admin = 'true'
WHERE
    id = 1;

--@BLOCK
UPDATE
    TIMESHEET
SET
    clock_out = '2025-03-08 23:10:25-07'
WHERE
    employees_ID = 1
    AND clock_in = '2025-03-08 19:10:25-07';

--@BLOCK
UPDATE
    TIMESHEET
SET
    total_hours = EXTRACT(EPOCH FROM (clock_out - clock_in)) / 3600
WHERE
    clock_out IS NOT NULL;


/*Delete table Section*/
--@BLOCK
DELETE FROM ADMIN
WHERE admin_id = 1;

--@BLOCK
DROP TABLE ADMIN;


/*Insert table sections*/
--@BLOCK
INSERT INTO employees(id, last_name, first_name, admin)
    VALUES (1, 'Swift', 'Dorthy', 'true');

--@BLOCK
INSERT INTO locations(location_name, location_address, lat_1, long_1, lat_2, long_2)
    VALUES ('Central Park', 'New York, NY, USA', 40.785091, -73.968285, 40.784000, -73.970000),
('Eiffel Tower', 'Champ de Mars, Paris, France', 48.858844, 2.294351, 48.857500, 2.292000);

--@BLOCK
INSERT INTO SCHEDULE(work_date, last_name, first_name, location_name, location_address, start_time, end_time)
    VALUES ('2025-01-12', 'ass', 'bob', 'wall mart park', 'New York, NY,USA', '14:30:00', '22:30:00'),
('2025-01-19', 'jay', 'hines', 'wall mart park', 'New York, NY,USA', '14:30:00', '22:30:00');

--@BLOCK
INSERT INTO TIMESHEET(employees_ID, last_name, first_name, location_name, clock_in)
    VALUES (2, 'ass', 'bob', 'wall mart park', '2020-06-22 19:10:25-07');

--@BLOCK
INSERT INTO TIMESHEET(employees_ID, last_name, first_name, location_name, clock_in)
    VALUES (1, 'jay', 'hines', 'Eiffel Tower', '2025-03-08 19:10:25-07');

--@BLOCK
INSERT INTO TIMESHEET(employees_ID, last_name, first_name, location_name, clock_in)
    VALUES (6379, 'MayWester', 'Nigel', 'test', '2025-05-23T08:58:44.551Z');

--@block
SELECT
    column_name,
    data_type
FROM
    information_schema.columns
WHERE
    table_name = 'schedule';

--@block
ALTER TABLE schedule
    ALTER COLUMN start_time TYPE time
    USING start_time::time,
    ALTER COLUMN end_time TYPE time
    USING end_time::time;

