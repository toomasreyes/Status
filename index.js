const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/estado/:token', async (req, res) => {
  const token = req.params.token;
  const url = `https://ride4me.io?t=${token}`;

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Eliminar "Special Request"
    await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      elements.forEach(el => {
        if (el.innerText?.includes('Special Request')) {
          el.remove();
        }
      });
    });

    const content = await page.content();
    await browser.close();
    res.send(content);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error cargando el estado');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
