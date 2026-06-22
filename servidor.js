const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/descargar', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Falta el parámetro url' });

  try {
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el video' });
  }
});

app.get('/', (req, res) => {
  res.send('⚔️ Servidor de Clipzen funcionando — Black Reaper Studios');
});

app.listen(PORT, () => {
  console.log(`Servidor Clipzen corriendo en http://localhost:${PORT}`);
});