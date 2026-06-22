const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Ruta raíz
app.get('/', (req, res) => {
  res.send('⚔️ Servidor de Clipzen funcionando — Black Reaper Studios');
});

// Obtiene info del video (título, miniatura, links)
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

// Descarga el archivo real y lo manda al navegador
app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Falta url' });

  try {
    const response = await axios.get(url, { responseType: 'stream' });
    const nombreArchivo = req.query.nombre || 'clipzen-video.mp4';
    res.setHeader('Content-Type', response.headers['content-type'] || 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"; filename*=UTF-8''${encodeURIComponent(nombreArchivo)}`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    response.data.pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Error al descargar archivo' });
  }
});