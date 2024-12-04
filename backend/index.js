const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Import the 'pg' library

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// Configure PostgreSQL connection
const pool = new Pool({
  user: 'edgararrizon',
  host: 'localhost',
  database: 'grocery_tracker',
  password: 'password',
  port: 5432, // Default PostgreSQL port
});

// Test database connection
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to the database!', result.rows[0].now);
  }
});

// GET all grocery stores
app.get('/api/stores', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM GroceryStores');
    res.json(rows);
  } catch (error) {
    console.log('req.params.store is : ', req.params.store)
    console.error('Error fetching grocery stores:', error);
    res.status(500).json({ error: 'Failed to fetch grocery stores' });
  }
});

// POST a new grocery store
app.post('/api/stores', async (req, res) => {
  const { store_name, location } = req.body;

  try {
    const { rows } = await pool.query(
      'INSERT INTO GroceryStores (store_name, location) VALUES ($1, $2) RETURNING *',
      [store_name, location]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error adding a grocery store:', error);
    res.status(500).json({ error: 'Failed to add a grocery store' });
  }
});

// Add more routes for GroceryTrip and GroceryTripItems similarly...

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});