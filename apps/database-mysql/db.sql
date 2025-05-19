## Create Schema
CREATE DATABASE AuthDB;
USE AuthDB;

CREATE TABLE User
(
    id          INTEGER NOT NULL AUTO_INCREMENT,
    email       VARCHAR(255) NOT NULL,
    hash        VARCHAR(72) NOT NULL,
    createdAt   DATETIME NOT NULL,
    updatedAt   DATETIME NOT NULL,

    PRIMARY KEY (id),
    UNIQUE (email)
);

CREATE TABLE Token
(
    id          INTEGER NOT NULL AUTO_INCREMENT,
    userId      INTEGER NOT NULL,
    jti         VARCHAR(36) NOT NULL,
    isRevoked   BOOLEAN NOT NULL,
    expiredAt   DATETIME NOT NULL,
    createdAt   DATETIME NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES User (id),
    UNIQUE (jti)
);

CREATE DATABASE EmployeeDB;
USE EmployeeDB;

CREATE TABLE Department
(
    id      INTEGER NOT NULL AUTO_INCREMENT,
    name    TEXT NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE Position
(
    id      INTEGER NOT NULL AUTO_INCREMENT,
    name    TEXT NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE Employee
(
    id              INTEGER NOT NULL AUTO_INCREMENT,
    userId          INTEGER NOT NULL,
    name            TEXT NOT NULL,
    gender          VARCHAR(1) NOT NULL,
    dob             DATETIME NOT NULL,
    departmentId    INTEGER NOT NULL,
    positionId      INTEGER NOT NULL,
    createdAt       DATETIME NOT NULL,
    updatedAt       DATETIME NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (departmentId) REFERENCES Department (id),
    FOREIGN KEY (positionId) REFERENCES Position (id),
    UNIQUE (userId)
);

CREATE TABLE EmployeeHistory
(
    id              INTEGER NOT NULL AUTO_INCREMENT,
    userId          INTEGER NOT NULL,
    name            TEXT NOT NULL,
    gender          VARCHAR(1) NOT NULL,
    dob             DATETIME NOT NULL,
    departmentId    INTEGER NOT NULL,
    positionId      INTEGER NOT NULL,
    createdAt       DATETIME NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (departmentId) REFERENCES Department (id),
    FOREIGN KEY (positionId) REFERENCES Position (id)
);

CREATE DATABASE AttendanceDB;
USE AttendanceDB;

CREATE TABLE AttendanceType
(
    id   INTEGER NOT NULL AUTO_INCREMENT,
    name TEXT    NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE Attendance
(
    id          INTEGER NOT NULL AUTO_INCREMENT,
    userId      INTEGER NOT NULL,
    typeId      INTEGER NOT NULL,
    dateTime    DATETIME NOT NULL,
    photo       TEXT,

    PRIMARY KEY (id),
    FOREIGN KEY (typeId) REFERENCES AttendanceType (id)
);

CREATE TABLE TargetAttendance
(
    id          INTEGER NOT NULL AUTO_INCREMENT,
    userId      INTEGER NOT NULL,
    weekday     INTEGER NOT NULL,
    startTime   TIME NOT NULL,
    endTime     TIME NOT NULL,
    createdAt   DATETIME NOT NULL,

    PRIMARY KEY (id),
    UNIQUE (userId, weekday)
);

CREATE TABLE TargetAttendanceHistory
(
    id          INTEGER NOT NULL AUTO_INCREMENT,
    userId      INTEGER NOT NULL,
    weekday     INTEGER NOT NULL,
    startTime   TIME NOT NULL,
    endTime     TIME NOT NULL,
    createdAt   DATETIME NOT NULL,

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