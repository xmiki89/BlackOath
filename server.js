const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc } = require('firebase/firestore');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);
const db = getFirestore();

// Bereinige ungültige Firestore Zeichen aus ID
function sanitizeId(str) {
  return str.replace(/[.#$[\]/]/g, '_').trim();
}

// Referenz erstellen mit bereinigtem ID
const getMemberDocRef = (name, nachname) => {
  const safeName = sanitizeId(name);
  const safeNachname = sanitizeId(nachname);
  const docId = `${safeName}_${safeNachname}`;
  return doc(db, 'BlackOath', 'main', 'members', docId);
};

// Member speichern
app.post('/save-member', async (req, res) => {
  const { name, nachname, id, email, password } = req.body;
  if (!name || !nachname || !id || !email || !password) {
    return res.status(400).send('Fehlende Parameter');
  }
  try {
    const memberRef = getMemberDocRef(name, nachname);
    await setDoc(memberRef, {
      name,
      nachname,
      id,
      email,
      password,
      registeredAt: new Date().toISOString(),
    });
    res.status(200).send('Mitglied gespeichert');
  } catch (error) {
    console.error('Fehler beim Speichern:', error);
    res.status(500).send('Fehler beim Speichern');
  }
});

// Member prüfen (existiert)
app.get('/check-member', async (req, res) => {
  const { name, nachname } = req.query;
  if (!name || !nachname) {
    return res.status(400).json({ exists: false });
  }
  try {
    const memberRef = getMemberDocRef(name, nachname);
    const docSnap = await getDoc(memberRef);
    res.json({ exists: docSnap.exists() });
  } catch (error) {
    console.error('Fehler beim Prüfen:', error);
    res.status(500).json({ exists: false });
  }
});

// Rolle speichern oder aktualisieren
app.post('/update-role', async (req, res) => {
  const { name, nachname, role } = req.body;
  if (!name || !nachname || !role) {
    return res.status(400).send('Fehlende Parameter');
  }
  try {
    const memberRef = getMemberDocRef(name, nachname);
    const docSnap = await getDoc(memberRef);
    if (!docSnap.exists()) {
      return res.status(404).send('Mitglied nicht gefunden');
    }
    await updateDoc(memberRef, { role });
    res.status(200).send('Rolle aktualisiert');
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Rolle:', error);
    res.status(500).send('Fehler beim Aktualisieren');
  }
});

// Rolle abfragen
app.get('/get-role', async (req, res) => {
  const { name, nachname } = req.query;
  if (!name || !nachname) {
    return res.status(400).json({ role: 'Member' });
  }
  try {
    const memberRef = getMemberDocRef(name, nachname);
    const docSnap = await getDoc(memberRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      res.json({ role: data.role || 'Member' });
    } else {
      res.status(404).json({ role: 'Member' });
    }
  } catch (error) {
    console.error('Fehler beim Abfragen der Rolle:', error);
    res.status(500).json({ role: 'Member' });
  }
});

// Member löschen
app.post('/delete-member', async (req, res) => {
  const { name, nachname } = req.body;
  if (!name || !nachname) {
    return res.status(400).send('Fehlende Parameter');
  }
  try {
    const memberRef = getMemberDocRef(name, nachname);
    await deleteDoc(memberRef);
    res.status(200).send('Mitglied gelöscht');
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
    res.status(500).send('Fehler beim Löschen');
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
  });
}

module.exports = app;
