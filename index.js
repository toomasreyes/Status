const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

// Usar el puerto de Render o 3000 si es local
const port = process.env.PORT || 3000;

app.get('/estado/:token', async (req, res) => {
  const { token } = req.params;
  const url = `https://ride4me.io?t=${token}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Eliminar sección de "Special Request"
    $("*:contains('Special Request')").remove();

    res.send($.html());
  } catch (err) {
    res.status(500).send('Error al cargar el estado');
  }
});

app.listen(port, () => {
  console.log(`Servidor proxy escuchando en http://localhost:${port}`);
});
