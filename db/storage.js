const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class Storage {
    read() {
        return readFile('db/db.json', 'utf8');
    }

    write(note) {
        return writeFile('db/db.json', JSON.stringify(note));
    }

    getNotes() {
        return this.read().then((notes => {
            let parsedNotes;

            try {
                parsedNotes = [].concat(JSON.parse(notes));
            } catch (err) {
                parsedNotes = [];
            }

            return parsedNotes;
        }))
    }

    async addNote(note) {
        const { title, text } = note;
        if (!title || !text) {
            throw new Error("Note 'title' and 'text' cannot be blank");
        }

        const newNote = { title, text, id: uuidv1() };

        const notes = await this.getNotes();
        const updatedNotes = [...notes, newNote];
        await this.write(updatedNotes);
        return newNote;
    }

    async removeNote(id) {
        const notes = await this.getNotes();
        const filteredNotes = notes.filter((note) => note.id !== id);
        return await this.write(filteredNotes);
    }
}

module.exports = new Storage();