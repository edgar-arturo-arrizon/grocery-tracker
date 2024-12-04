DROP DATABASE IF EXISTS grocery_tracker;

CREATE DATABASE grocery_tracker;

\c grocery_tracker;

DROP TABLE IF EXISTS GroceryTripItems;
DROP TABLE IF EXISTS GroceryTrip;
DROP TABLE IF EXISTS GroceryStores;

CREATE TABLE GroceryStores (
    store_id SERIAL PRIMARY KEY,
    store_name VARCHAR(255) NOT NULL
);

CREATE TABLE GroceryTrip (
    trip_id SERIAL PRIMARY KEY,
    store_id INT REFERENCES GroceryStores(store_id),
    trip_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    trip_total INT
);

CREATE TABLE GroceryTripItems (
    item_id SERIAL PRIMARY KEY,
    trip_id INT REFERENCES GroceryTrip(trip_id),
    item_name VARCHAR(255) NOT NULL,
    quantity INT,
    unit_cost DECIMAL (10, 2)
);