/*
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Statische Dateien aus 'public'-Ordner bereitstellen
app.use(express.static(path.join(__dirname, 'public')));

// Root-Route liefert index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/quiz-index.html'));
});

app.listen(port, () => {
  console.log(`Server läuft unter http://localhost:${port}`);
});
*/

const express = require('express');
const path = require('path');
const fs = require('fs');  // <- Zum Schreiben in Dateien
const app = express();
const port = 3000;

// Middleware, um JSON-Daten aus POST-Anfragen zu verarbeiten
app.use(express.json());

// Statische Dateien aus dem "public"-Ordner bereitstellen
app.use(express.static(path.join(__dirname, 'public')));

// Route für die Startseite
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/quiz-index.html'));
});


//NEU: POST-Route zum Empfangen und Speichern von Runden-Daten
app.post('/api/saveRound', (req, res) => {
  const roundData = req.body;

  // CSV-Zeile vorbereiten
  const csvRow = [
    roundData.roundNumber,
    roundData.timeStamp,
    roundData.userId,
    roundData.score,
    roundData.roundStatus,
    roundData.documentation.join(' | ')  // Fragen mit | trennen
  ].map(field => `"${field}"`).join(';');

  // Ziel-Datei (zentrale Datei im Projektverzeichnis)
  const filePath = path.join(__dirname, 'leaderboard.csv');

  // Prüfen, ob Datei existiert, falls nicht: Header schreiben
  if (!fs.existsSync(filePath)) {
    const header = `"Runde";"Zeit";"Spieler";"Punkte";"Status";"Fragen"\n`;
    fs.writeFileSync(filePath, header);
  }

  // CSV-Zeile anhängen
  fs.appendFile(filePath, csvRow + '\n', (err) => {
    if (err) {
      console.error('Fehler beim Schreiben der Datei:', err);
      return res.status(500).send('Fehler beim Speichern der Daten.');
    }
    res.send('Runde gespeichert');
  });
});

//Admin Post
/*const playerStates = new Map(); // userId → { aktuelle Frage, Punkte, Status }

app.post("/api/update-state", (req, res) => {
  const data = req.body;
  playerStates.set(data.userId, {
    currentQuestionIndex: data.currentQuestionIndex,
    score: data.score,
    status: data.status,
    lastUpdate: new Date()
  });
  res.sendStatus(200);
});*/


// Server starten
app.listen(port, '0.0.0.0', () => {
  console.log(`Server läuft unter http://localhost:${port}`);
});

