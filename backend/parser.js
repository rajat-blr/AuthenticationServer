const express = require('express')
const bodyparser = require('body-parser');
const req = require('express/lib/request');
const res = require('express/lib/response');
const crypto = require('crypto')

const app = express();
const port = 3100;

app.use(bodyparser.json());

const users = [];

function generateAuthToken() {
    return crypto.randomBytes(30).toString('hex')
}

app.post('/signup', (req, res) => {
    const { username, password, firstname, lastname } = req.body;
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    const userID = Math.floor(Math.random() * 10000);

    users.push({ id: userID, username, password, firstname, lastname });

    res.status(201).json({ message: 'User created successfully', userID });

});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const authToken = generateAuthToken();

        res.status(200).json({
            message: 'Login Successful',
            userID: user.userID,
            firstname: user.firstname,
            lastname: user.lastname,
            authToken
        })
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
})

app.get('/data', (req, res) => {
    const { username, password } = req.headers;

    if (!username || !password) {
        return res.status(401).json({ error: 'Username and password required' })
    }

    const user = users.find(u => u.username === username && u.password === password);


    if (user) {
        const userData = users.map(u => ({ id: u.id, firstname: u.firstname, lastname:u.lastname }))
        res.status(200).json({users: userData});
    } else{
        res.status(401).json({error: 'Invalid credentials'})
    }
})

app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})




