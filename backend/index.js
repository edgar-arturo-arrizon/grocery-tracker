const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configure PostgreSQL connection
const pool = new Pool({
  user: 'edgararrizon',
  host: 'localhost',
  database: 'grocery_tracker',
  password: 'password',
  port: 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to the database!', result.rows[0].now);
  }
});

// GET grocery stores
app.get('/api/stores', async (req, res) => {
  const store_name = req.query.store_name

  try {
    let query = 'SELECT * FROM GroceryStores';
    const queryParams = [];

    if (store_name) {
      query += ' WHERE store_name = $1';
      queryParams.push(store_name);
    }

    const {rows } = await pool.query(query, queryParams)
    res.json(rows);
  } catch (error) {
    console.error('Error fetching grocery stores:', error);
    res.status(500).json({ error: 'Failed to fetch grocery stores' });
  }
})

// GROCERY TRIPS
app.get('/api/grocerytrips', async (req, res) => {
  const startDate = req.query.start_date;
  const endDate = req.query.end_date;

  try {
    let query = 'SELECT * FROM GroceryTrip';
    const queryParams = [];

    if (startDate && endDate) {
      query += ' WHERE trip_date BETWEEN $1 AND $2';
      queryParams.push(startDate, endDate);
    } else if (startDate) {
      query += ' WHERE trip_date >= $1';
      queryParams.push(startDate);
    } else if (endDate) {
      query += ' WHERE trip_date <= $1';
      queryParams.push(endDate);
    }

    const { rows } = await pool.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching grocery trips:', error);
    res.status(500).json({ error: 'Failed to fetch grocery trips' });
  }
});

app.post('/api/grocerytrips', async (req, res) => {
  const { trip_date, store_name, trip_total, items } = req.body;

  try {
    // Check if the store name already exists
    const storeResult = await pool.query(
      'SELECT store_id FROM GroceryStores WHERE store_name = $1',
      [store_name]
    );

    let store_id;
    if (storeResult.rows.length === 0) {
      // If the store doesn't exist, add it to the GroceryStores table
      const newStoreResult = await pool.query(
        'INSERT INTO GroceryStores (store_name) VALUES ($1) RETURNING store_id',
        [store_name]
      );
      store_id = newStoreResult.rows[0].store_id;
    } else {
      // If the store exists, get its store_id
      store_id = storeResult.rows[0].store_id;
    }

    // Insert the grocery trip
    const tripResult = await pool.query(
      'INSERT INTO GroceryTrip (store_id, trip_date, trip_total) VALUES ($1, $2, $3) RETURNING *',
      [store_id, trip_date, trip_total]
    );
    const trip_id = tripResult.rows[0].trip_id;

    // Insert the grocery trip items
    for (const item of items) {
      const query = `
        INSERT INTO GroceryTripItems (trip_id, item_name, quantity, unit_cost, type, weight)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      const queryParams = [trip_id, item.item_name, item.quantity, item.unit_cost, item.type, item.weight];

      await pool.query(query, queryParams);
    }

    res.status(201).json({ message: 'Grocery trip added successfully' });
  } catch (error) {
    console.error('Error adding a grocery trip:', error);
    res.status(500).json({ error: 'Failed to add a grocery trip' });
  }
});

// GET all grocery items
app.get('/api/groceryitems', async (req, res) => {
  
})
// GET a filtered list of grocery item

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});