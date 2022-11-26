
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
    Username VARCHAR(50) UNIQUE NOT NULL DEFAULT '',
    Email VARCHAR(50) UNIQUE NOT NULL DEFAULT '',
    Password VARCHAR(50) NOT NULL DEFAULT '',
    PRIMARY KEY (UserID),
    INDEX login (Username)
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
    Type INT NOT NULL CHECK(Type < 2 AND Type > 0),
    PRIMARY KEY (SurveyID),
    FOREIGN KEY (CreatorID) REFERENCES users(UserID),
    INDEX ended (EndDate)
);

-- Assigned_To Table
CREATE TABLE assigned_to (
    SurveyID INT NOT NULL,
    UserID INT NOT NULL,
    DateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Type1 INT CHECK(Type1 < 6 AND Type1 > 0),
    Type2 TEXT(1250),
    PRIMARY KEY(SurveyID, UserID),
    FOREIGN KEY (SurveyID) REFERENCES surveys(SurveyID),
    FOREIGN KEY (UserID) REFERENCES surveys(SurveyID)
);

-- Results Table
CREATE TABLE results (
    SurveyID INT NOT NULL,
    DateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Type1 INT CHECK(Type1 < 6 AND Type1 > 0),
    Type2 TEXT(1250),
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
