## Create Schema
CREATE DATABASE AuthDB;
USE AuthDB;

CREATE TABLE User
(
    id          INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    email       VARCHAR(255) NOT NULL UNIQUE,
    hash        VARCHAR(72) NOT NULL,
    createdAt   TIMESTAMP NOT NULL,
    updatedAt   TIMESTAMP NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE Token
(
    id          INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    userId      INTEGER NOT NULL,
    jti         VARCHAR(36) NOT NULL UNIQUE,
    isRevoked   BOOLEAN NOT NULL,
    expiredAt   TIMESTAMP NOT NULL,
    createdAt   TIMESTAMP NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES User (id)
);

CREATE DATABASE EmployeeDB;
USE EmployeeDB;

CREATE TABLE Department
(
    id      INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    name    TEXT NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE Position
(
    id      INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    name    TEXT NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE Employee
(
    id              INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    userId          INTEGER NOT NULL UNIQUE,
    name            TEXT NOT NULL,
    gender          VARCHAR(1) NOT NULL,
    dob             DATETIME NOT NULL,
    departmentId    INTEGER NOT NULL,
    positionId      INTEGER NOT NULL,
    createdAt       TIMESTAMP NOT NULL,
    updatedAt       TIMESTAMP NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (departmentId) REFERENCES Department (id),
    FOREIGN KEY (positionId) REFERENCES Position (id)
);

CREATE TABLE EmployeeHistory
(
    id              INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    userId          INTEGER NOT NULL UNIQUE,
    name            TEXT NOT NULL,
    gender          VARCHAR(1) NOT NULL,
    dob             DATETIME NOT NULL,
    departmentId    INTEGER NOT NULL,
    positionId      INTEGER NOT NULL,
    createdAt       TIMESTAMP NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (departmentId) REFERENCES Department (id),
    FOREIGN KEY (positionId) REFERENCES Position (id)
);

CREATE DATABASE AttendanceDB;
USE AttendanceDB;

CREATE TABLE AttendanceType
(
    id   INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    name TEXT    NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE Attendance
(
    id          INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    userId      INTEGER NOT NULL,
    typeId      INTEGER NOT NULL,
    dateTime    TIME NOT NULL,
    photo       TEXT,

    PRIMARY KEY (id),
    FOREIGN KEY (typeId) REFERENCES AttendanceType (id)
);

CREATE TABLE TargetAttendance
(
    id          INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    userId      INTEGER NOT NULL,
    weekday     INTEGER NOT NULL,
    startTime   TIME NOT NULL,
    endTime     TIME NOT NULL,
    createdAt   TIMESTAMP NOT NULL,
    updatedAt   TIMESTAMP NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE TargetAttendanceHistory
(
    id          INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
    userId      INTEGER NOT NULL,
    weekday     INTEGER NOT NULL,
    startTime   TIME NOT NULL,
    endTime     TIME NOT NULL,
    createdAt   TIMESTAMP NOT NULL,

    PRIMARY KEY (id)
);

## Create User Auth
CREATE USER 'auth'@'%' IDENTIFIED BY 'authPassword';
CREATE USER 'employee'@'%' IDENTIFIED BY 'employeePassword';
CREATE USER 'attendance'@'%' IDENTIFIED BY 'attendancePassword';


## Grant Permission
GRANT ALL ON AuthDB.* TO 'auth'@'%';
GRANT ALL ON EmployeeDB.* TO 'employee'@'%';
GRANT ALL ON AttendanceDB.* TO 'attendance'@'%';

FLUSH PRIVILEGES;