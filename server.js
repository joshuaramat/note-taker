const express = require('express');
const fs = require('fs');
const db = require('./db/db.json');
const path = require('path');
const router = require('express').Router();
const storage = require('./db/storage')

// initiates server
const app = express();

// set up for dynamic PORT
const PORT = process.env.PORT || 3001

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
        JSON.stringify(body, null, 2)
    );
    return body;
}

function validateNote(note) {
    if (!db.title || typeof db.title !== 'string') {
        return false;
    }

    if (!db.text || typeof db.text !== 'string') {
        return false;
    }
    return true;
}

router.get('/notes', (req, res) => {
    storage
        .getNotes()
        .then((notes) => {
            return res.join(notes);
        })
        .catch((err) => res.status(500).json(err));
});

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

router.post('/notes', (req, res) => {
    storage
        .addNote(req.body)
        .then((note) => res.json(note))
        .catch((err) => res.status(500).json(err));
})

router.delete('/notes/:id', (req, res) => {
    storage
        .removeNote(req.params.id)
        .then(() => res.json({ ok: true }))
        .catch((err) => res.status(500).json(err));
});

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