const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./notes.db');

app.use(bodyParser.json());
app.use(cors());

// Create notes table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL
    )
  `);
});

// Save a note
app.post('/notes', (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  db.run('INSERT INTO notes (content) VALUES (?)', [content], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to save note' });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// List all notes
app.get('/notes', (req, res) => {
  db.all('SELECT * FROM notes', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve notes' });
    }
    res.json(rows);
  });
});

// Delete a note
app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM notes WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete note' });
    }
    res.status(204).end();
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
