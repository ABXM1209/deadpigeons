DROP SCHEMA IF EXISTS deadpigeons CASCADE;
CREATE SCHEMA IF NOT EXISTS deadpigeons;

-- ======================
-- Admins Table
-- ======================
CREATE TABLE deadpigeons.Admins
(
    id        text PRIMARY KEY NOT NULL,
    name      text NOT NULL,
    email     text NOT NULL,
    password  text NOT NULL
);

-- ======================
-- Users Table
-- ======================
CREATE TABLE deadpigeons.Users
(
    id        text PRIMARY KEY NOT NULL,
    name      text NOT NULL,
    phone     text NOT NULL,
    email     text NOT NULL,
    password  text NOT NULL,
    balance   int NOT NULL,
    isActive  boolean NOT NULL
);

-- ======================
-- Boards Table
-- ======================
CREATE TABLE deadpigeons.Boards
(
    id             text PRIMARY KEY NOT NULL,
    name           text NOT NULL,
    weekNumber     int NOT NULL,
    weekRepeat     int,
    totalWinners   int NOT NULL,
    winningNumbers text NOT NULL,
    winningUsers   text NOT NULL,
    isOpen         boolean NOT NULL
);

-- ======================
-- Transactions Table
-- ======================
CREATE TABLE deadpigeons.Transactions
(
    id             text PRIMARY KEY NOT NULL,
    username       text NOT NULL,
    userId         text NOT NULL,
    transactionId  text NOT NULL,
    status         int NOT NULL,
    balance        int NOT NULL,
    transactionDate timestamp NOT NULL
);

-- ======================
-- BoardHistory Table
-- ======================
CREATE TABLE deadpigeons.BoardHistory
(
    id        text PRIMARY KEY NOT NULL,
    userId    text NOT NULL REFERENCES deadpigeons.Users(id),
    boardId   text NOT NULL REFERENCES deadpigeons.Boards(id),
    won       boolean NOT NULL,
    playedAt  timestamp NOT NULL
);
