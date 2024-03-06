// Works Cited by ChatGPT
// Works on localhost:3000
// Unsure if this counts as My new finalprojectsprint1

const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Database connection setup
const pool = mysql.createPool({
    host: 'cis3368fall.c5nfalmzzodd.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'cisfall2023',
    database: 'cis3368finalproject',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.render('login'); // Render the login.ejs template
});

app.get('/floors', (req, res) => {
    pool.query('SELECT * FROM floor', (err, rows) => {
        if (err) {
            // handle error
            return res.status(500).send('Error retrieving floors');
        }
        res.render('floors', { floors: rows });
    });
});

// Additional CRUD routes for floors

// Create a new floor
app.post('/api/floors', (req, res) => {
    const { level, name } = req.body;
    pool.query('INSERT INTO floor (level, name) VALUES (?, ?)', [level, name], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error adding new floor');
        }
        res.json({ id: results.insertId, level, name }); // Send back the new floor data
    });
});


app.delete('/api/floors/:id', (req, res) => {
    const id = req.params.id;
    pool.query('DELETE FROM floor WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting floor');
        }
        res.json({ message: 'Floor deleted successfully' });
    });
});


app.delete('/api/floors/:id', (req, res) => {
    // your code to delete the floor from the database
});


// ... Existing code ...

// Rooms Routes

app.get('/rooms', (req, res) => {
    // Retrieve the list of floors from your database
    pool.query('SELECT * FROM floor', (err, floorsData) => {
        if (err) {
            // Handle the error
            return res.status(500).send('Error retrieving floors');
        }
        
        // Retrieve the list of rooms from your database
        pool.query('SELECT * FROM room', (err, roomsData) => {
            if (err) {
                // Handle the error
                return res.status(500).send('Error retrieving rooms');
            }

            // Render the rooms.ejs template and pass both floors and rooms data to it
            res.render('rooms', { floors: floorsData, rooms: roomsData });
        });
    });
});

// Add a new room (POST)
app.post('/api/rooms', (req, res) => {
    const { number, capacity, floor } = req.body;
    pool.query('INSERT INTO room (number, capacity, floor) VALUES (?, ?, ?)', [number, capacity, floor], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error adding new room');
        }
        res.json({ id: results.insertId, number, capacity, floor }); // Send back the new room data
    });
});


app.delete('/api/rooms/:id', (req, res) => {
    const id = req.params.id;
    pool.query('DELETE FROM room WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting room');
        }
        res.json({ message: 'Room deleted successfully' });
    });
});


// Residents Routes
app.get('/residents', (req, res) => {
    // Retrieve the list of rooms from your database
    pool.query('SELECT * FROM room', (err, roomsData) => {
        if (err) {
            // Handle the error
            return res.status(500).send('Error retrieving rooms');
        }

        // Retrieve the list of residents from your database
        pool.query('SELECT * FROM resident', (err, residentsData) => {
            if (err) {
                // Handle the error
                return res.status(500).send('Error retrieving residents');
            }

            // Render the residents.ejs template and pass both residents and rooms data to it
            res.render('residents', { residents: residentsData, rooms: roomsData });
        });
    });
});



app.post('/api/residents', (req, res) => {
    const { firstname, lastname, age, room } = req.body;
    pool.query('INSERT INTO resident (firstname, lastname, age, room) VALUES (?, ?, ?, ?)', [firstname, lastname, age, room], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error adding new resident');
        }
        res.json({ id: results.insertId, firstname, lastname, age, room });
    });
});

app.delete('/api/residents/:id', (req, res) => {
    const id = req.params.id;
    pool.query('DELETE FROM resident WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting resident');
        }
        res.json({ message: 'Resident deleted successfully' });
    });
});


app.post('/login', (req, res) => {
    // Example credentials
    const username = "admin";
    const password = "password";

    // Check if the provided credentials match
    if (req.body.username === username && req.body.password === password) {
        // Redirect to the dashboard after successful login
        res.redirect('/dashboard');
    } else {
        // Redirect back to the login page or send an error message
        res.send("Invalid credentials");
    }
});

app.get('/dashboard', (req, res) => {
    // Fetch all necessary data for dashboard view from the database
    // and pass it to the dashboard.ejs template
    // This is a placeholder, implement as needed based on your actual dashboard requirements
    res.render('dashboard');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
