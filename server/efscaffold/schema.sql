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
    id          text PRIMARY KEY NOT NULL,
    isOpen      boolean NOT NULL,
    weekNumber  int NOT NULL
);

-- ======================
-- AdminBoard Table
-- ======================
CREATE TABLE deadpigeons.AdminBoard
(
    id             text PRIMARY KEY NOT NULL,
    boardId        text NOT NULL REFERENCES deadpigeons.Boards(id) ON DELETE CASCADE,
    winningNumbers int[] NOT NULL
);

-- ======================
-- UserBoard Table
-- ======================
CREATE TABLE deadpigeons.UserBoard
(
    id               text PRIMARY KEY NOT NULL,
    boardId          text NOT NULL REFERENCES deadpigeons.Boards(id) ON DELETE CASCADE,
    userId           text NOT NULL REFERENCES deadpigeons.Users(id) ON DELETE CASCADE,
    guessingNumbers  int[] NOT NULL,
    weekRepeat       int NOT NULL
);

-- ======================
-- AdminBoardHistory Table
-- ======================
CREATE TABLE deadpigeons.AdminBoardHistory
(
    id             text PRIMARY KEY NOT NULL,
    boardId        text NOT NULL REFERENCES deadpigeons.Boards(id) ON DELETE CASCADE,
    totalWinners   int NOT NULL,
    winningUsers   text[] NOT NULL,
    date           timestamp NOT NULL
);

-- ======================
-- UserBoardHistory Table
-- ======================
CREATE TABLE deadpigeons.UserBoardHistory
(
    id         text PRIMARY KEY NOT NULL,
    userId     text NOT NULL REFERENCES deadpigeons.Users(id) ON DELETE CASCADE,
    boardId    text NOT NULL REFERENCES deadpigeons.Boards(id) ON DELETE CASCADE,
    isWinner   boolean NOT NULL,
    playedAt   timestamp NOT NULL
);

-- ======================
-- Transactions Table
-- ======================
CREATE TABLE deadpigeons.Transactions
(
    id              text PRIMARY KEY NOT NULL,
    username        text NOT NULL,
    userId          text NOT NULL,
    transactionId   text NOT NULL,
    status          int NOT NULL,
    balance         int NOT NULL,
    transactionDate timestamp NOT NULL
);
