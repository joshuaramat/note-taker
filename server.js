const express = require('express');
const fs = require('fs');
const db = require('./db/db.json');
const util = require('util');
const path = require('path');

// initiates server
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

function queryFilter(query, db) {
    let filteredResults = db;
    if (query.noteTitle) {
        filteredResults = filteredResults.filter(
            (db) => (db.noteTitle = query.noteTitle)
        );
    }
    if (query.id) {
        filteredResults = filteredResults.filter((db) => (db.id = query.id));
    }
    return filteredResults;
}

function findById(id, db) {
    const result = db.filter((db) => db.id === id)[0];
    return result;
}

function createNewNote(body, db) {
    db.push(body);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(db, null, 2)
    );
    return db;
}

app.get('/api/notes', (req, res) => {
    let results = db;
    if(req.query) {
        results = queryFilter(req.query, results);
    }

    res.json(results);
});

app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, db);
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
});

app.post('/api/notes', (req, res) => {
    req.body.id = db.length.toString();
    const dbArray = db;
    const note = createNewNote(req.body, dbArray);
    res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params.id);
});

// root routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes',(req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// run server
app.listen(PORT, () => {
    console.log(`API server now listening on ${PORT}`);
});