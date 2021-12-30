const express = require('express');
const db = require('./db/db.json')
const path = require('path');
const fs = require('fs');
const { notStrictEqual } = require('assert');

// initiates server
const app = express();

// set up for dynamic PORT
const PORT = process.env.PORT || 3001

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

function queryFilter(query, dbArray) {
    let filteredResults = dbArray;
    if (query,noteTitle) {
        filteredResults = filteredResults.filter(
            (db) => (db.noteTitle = query.noteTitle)
        );
    }
    if (query.id) {
        filteredResults = filteredResults.filter((db) => (db.id = query.id));
    }
    return filteredResults;
}

function findById(id, dbArray) {
    const result = dbArray.filter((db) => db.id === id)[0];
    return result;
}

function createNewNote(bodu, dbArray) {
    const note = body;
    dbArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.son'),
        JSON.stringify({ db: dbArray }, null, 2)
    );
    return body;
}

app.get('/api/notes', (req, res) => {
    let results = db;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
});

app.post('/api/notes', (req, res) => {
    req.body.id = db.length.toString();
    const note = createNewNote(req.body, db);
    res.json(req.body);
})

app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, db);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes',(req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.delete('/api/notes/:id', (req, res) => {
    const deleteNote = db.params.id;
    if (deleteNote === -1)
    return res.status(404).json({});
    notes.splice(deleteNote, 1);
    res.join(notes);
})

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.post('/api/notes', (req, res) => {
    req.body.id = db.length.toString();
    const note = createNewNote(req.body, db);
    res.json(req.body);
});

app.listen(PORT, () => {
    console.log(`API server now listening on ${PORT}`);
})