create TABLE administrator
(
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(255),
    surname VARCHAR(255),
    phone   VARCHAR(10),
    password VARCHAR(255)
);

create TABLE boss
(
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(255),
    surname VARCHAR(255),
    phone   VARCHAR(10),
    password VARCHAR(255)
);

create TABLE "user"
(
    id      SERIAL PRIMARY KEY,
    boss_id INTEGER,
    FOREIGN KEY (boss_id) REFERENCES boss(id),
    name    VARCHAR(255),
    surname VARCHAR(255),
    phone   VARCHAR(10),
    password VARCHAR(255)
);