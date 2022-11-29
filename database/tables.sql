
-- Drop all the tables to then recreate them
DROP TABLE users;
DROP TABLE surveys;
DROP TABLE assigned_to;
DROP TABLE results;

-- User Table
CREATE TABLE users (
    UserID INT NOT NULL AUTO_INCREMENT,
    DateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    DateLastLoggedIn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FirstName VARCHAR(50) NOT NULL DEFAULT '',
    LastName VARCHAR(50) NOT NULL DEFAULT '',
    Email VARCHAR(50) UNIQUE NOT NULL DEFAULT '',
    Password VARCHAR(50) NOT NULL DEFAULT '',
    PRIMARY KEY (UserID)
);

-- Survey Table
-- DATE format - YYYY-MM-DD
CREATE TABLE surveys (
    SurveyID INT NOT NULL AUTO_INCREMENT,
    CreatorID INT NOT NULL,
    DateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Title VARCHAR(50) NOT NULL DEFAULT '',
    Description TEXT NOT NULL,
    StartDate DATE NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    EndDate DATE NOT NULL DEFAULT (CURRENT_TIMESTAMP + 7),
    NumType1 INT NOT NULL CHECK(NumType1 < 6 AND NumType1 >= 0) DEFAULT (0), 
    NumType2 INT NOT NULL CHECK(NumType2 < 6 AND NumType2 >= 0) DEFAULT (0),
    Type1Q1 TEXT DEFAULT '',
    Type1Q2 TEXT DEFAULT '',
    Type1Q3 TEXT DEFAULT '',
    Type1Q4 TEXT DEFAULT '',
    Type1Q5 TEXT DEFAULT '',
    Type2Q1 TEXT DEFAULT '',
    Type2Q2 TEXT DEFAULT '',
    Type2Q3 TEXT DEFAULT '',
    Type2Q4 TEXT DEFAULT '',
    Type2Q5 TEXT DEFAULT '',
    PRIMARY KEY (SurveyID),
    FOREIGN KEY (CreatorID) REFERENCES users(UserID),
    INDEX ended (EndDate)
);

-- Assigned_To Table
CREATE TABLE assigned_to (
    SurveyID INT NOT NULL,
    UserID INT NOT NULL,
    DateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Type1A1 INT CHECK(Type1A1 < 6 AND Type1A1 > 0),
    Type1A2 INT CHECK(Type1A2 < 6 AND Type1A2 > 0),
    Type1A3 INT CHECK(Type1A3 < 6 AND Type1A3 > 0),
    Type1A4 INT CHECK(Type1A4 < 6 AND Type1A4 > 0),
    Type1A5 INT CHECK(Type1A5 < 6 AND Type1A5 > 0),
    Type2A1 TEXT(1250),
    Type2A2 TEXT(1250),
    Type2A3 TEXT(1250),
    Type2A4 TEXT(1250),
    Type2A5 TEXT(1250),
    PRIMARY KEY(SurveyID, UserID),
    FOREIGN KEY (SurveyID) REFERENCES surveys(SurveyID),
    FOREIGN KEY (UserID) REFERENCES surveys(SurveyID)
);

-- Results Table
CREATE TABLE results (
    SurveyID INT NOT NULL,
    DateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Type1A1 INT CHECK(Type1A1 < 6 AND Type1A1 > 0),
    Type1A2 INT CHECK(Type1A2 < 6 AND Type1A2 > 0),
    Type1A3 INT CHECK(Type1A3 < 6 AND Type1A3 > 0),
    Type1A4 INT CHECK(Type1A4 < 6 AND Type1A4 > 0),
    Type1A5 INT CHECK(Type1A5 < 6 AND Type1A5 > 0),
    Type2A1 TEXT(1250),
    Type2A2 TEXT(1250),
    Type2A3 TEXT(1250),
    Type2A4 TEXT(1250),
    Type2A5 TEXT(1250),
    FOREIGN KEY (SurveyID) REFERENCES surveys(SurveyID)
);

-- Describe the tables and indexes
DESCRIBE users;
SHOW INDEXES IN users;
DESCRIBE surveys;
SHOW INDEXES IN surveys;
DESCRIBE assigned_to;
SHOW INDEXES IN assigned_to;
DESCRIBE results;
SHOW INDEXES IN results;

-- Create User
CREATE user 'TheBeast' IDENTIFIED BY 'WeLoveCOP4710';
GRANT ALL PRIVILEGES ON COP4710.* TO 'TheBeast'@'%';
