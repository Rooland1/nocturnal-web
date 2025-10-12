const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const registrationFilePath = path.join(__dirname, 'registration.txt');

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing registration fields' });
  }

  const registrationData = 'Felhasználónév: ' + username + '\\nEmail: ' + email + '\\nJelszó: ' + password + '\\nRegisztráció dátuma: ' + new Date().toLocaleString() + '\\n\\n';

  fs.appendFile(registrationFilePath, registrationData, (err) => {
    if (err) {
      console.error('Error writing registration data:', err);
      return res.status(500).json({ error: 'Failed to save registration data' });
    }
    res.json({ message: 'Registration data saved successfully' });
  });
});

const messagesFilePath = path.join(__dirname, 'messages.txt');

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Hiányzó mezők: név, email vagy üzenet' });
  }

  const messageData = `Név: ${name}\nEmail: ${email}\nÜzenet: ${message}\nDátum: ${new Date().toLocaleString()}\n\n`;

  fs.appendFile(messagesFilePath, messageData, (err) => {
    if (err) {
      console.error('Error writing message data:', err);
      return res.status(500).json({ error: 'Nem sikerült elmenteni az üzenetet' });
    }
    res.json({ message: 'Üzenet sikeresen elküldve' });
  });
});

app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
