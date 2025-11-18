DROP SCHEMA IF EXISTS deadpigeons CASCADE;
CREATE SCHEMA IF NOT EXISTS deadpigeons;

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

CREATE TABLE deadpigeons.Boards
(
    id        text PRIMARY KEY NOT NULL,
    name      text NOT NULL,
    weekNumber TIMESTAMPTZ,
    totalWinners int NOT NULL,
    winningNumbers text NOT NULL,
    winningUsers text NOT NULL,
    isOpen boolean NOT NULL
);

CREATE TABLE deadpigeons.Admins
(
    id        text PRIMARY KEY NOT NULL,
    name      text NOT NULL,
    email     text NOT NULL,
    password  text NOT NULL
);

CREATE TABLE deadpigeons.Transactions
(
    id        text PRIMARY KEY NOT NULL,
    username  text NOT NULL,
    transactionId text NOT NULL,
    status int NOT NULL,
    balance int NOT NULL
);
