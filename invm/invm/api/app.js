const express = require('express');
const path = require('path');
const connection = require('./conn');  
const queryRoutes = require('./routers/queries');

const app = express();
const port = 4040;

app.use(express.json());
app.use('/queries', queryRoutes);

// Static middleware to serve other assets like CSS, JS, and images
app.use(express.static(path.join(__dirname,'..' ,'public')));  // Correct location for serving static files

// Home redirect route
app.get('/', (req, res) => {
    res.redirect('/home');  // Redirect to the /home route
});

// Serve the home page at /home
app.get('/home', (req, res) => { 
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));  // Updated path
});

// Other routes (signup, purchase, sell, etc.)
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));  // Updated path
});

app.get('/ok', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'home.html'));  // Updated path
});

app.get('/queries/purchase', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'purchase.html'));  // Updated path
});

app.get('/queries/sell', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'sell.html'));  // Updated path
});

app.post('/userSignup', async (req, res) => {
    const { username, email, password, phone } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password || !phone) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const query = `INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)`;
        const [result] = await connection.query(query, [username, email, password, phone]);

        res.status(201).json({ message: 'User signed up successfully! Go To Login Page', userId: result.insertId });
    } catch (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res, next) => {
    try {
        const { mail, password } = req.body;
        const [dbPass] = await connection.query(`SELECT Password FROM Users where Email=?`, [mail]);

        if (password === dbPass[0].Password) { 
            console.log("logged in ");
            res.send("logged in");
        } else {
            res.status(400).json({"error": "wrong password! please try again."});
        } 
    } catch {
        res.status(400).json({"error": "Mail not Found"});
    }
});

app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
