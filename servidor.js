const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()

// Permite que Clipzen se conecte a este servidor
app.use(cors())

// Ruta principal — para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.send('⚔️ Servidor de Clipzen funcionando — Black Reaper Studios')
})

// Ruta de descarga — el corazón de Clipzen
app.get('/descargar', async (req, res) => {
  const urlTiktok = req.query.url

  // Verificar que mandaron un enlace
  if (!urlTiktok) {
    return res.status(400).json({ error: 'Falta el enlace del video.' })
  }

  try {
    // Paso 1: Pedir la info del video a TikWM
    const respuesta = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(urlTiktok)}&hd=1`)
    const data = respuesta.data

    if (data.code !== 0 || !data.data) {
      return res.status(400).json({ error: 'No se pudo procesar el video. Verifica que sea público.' })
    }

    const video = data.data

    // Paso 2: Elegir la mejor URL del video
    const videoUrl = video.hdplay || video.play || video.wmplay

    if (!videoUrl) {
      return res.status(400).json({ error: 'No se encontró el enlace de descarga.' })
    }

    // Paso 3: Descargar el video en NUESTRO servidor
    const videoRespuesta = await axios.get(videoUrl, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://www.tiktok.com/'
      }
    })

    // Paso 4: Entregar el video al usuario como descarga directa
    res.setHeader('Content-Disposition', 'attachment; filename="clipzen.mp4"')
    res.setHeader('Content-Type', 'video/mp4')
    videoRespuesta.data.pipe(res)

  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ error: 'Error interno del servidor. Intenta de nuevo.' })
  }
})

// Encender el servidor
const PUERTO = process.env.PORT || 3000
app.listen(PUERTO, () => {
  console.log(`✅ Servidor Clipzen corriendo en http://localhost:${PUERTO}`)
})