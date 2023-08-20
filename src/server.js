const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3001; // Change this to your desired port number

app.use(express.json());

app.get('/interact-with-virtual-assistant', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the AGL contact page
    await page.goto('https://rishi.js.org/omega/');

    // Wait for the "Start Chat" button to become available and click it
    await page.waitForSelector('.chat-button');
    await page.click('.chat-button');

    // Wait for the virtual assistant chat popup to load
    await page.waitForSelector('.virtual-assistant');

    // Interact with the virtual assistant
    const inputField = await page.$('.virtual-assistant .chat-input');
    await inputField.type(req.query.message);

    const sendButton = await page.$('.virtual-assistant .send-button');
    await sendButton.click();

    // Wait for the virtual assistant response
    await page.waitForSelector('.virtual-assistant .chat-response');

    // Capture a screenshot of the virtual assistant interaction
    await page.screenshot({ path: 'virtual_assistant_interaction.png' });

    res.json({ message: 'Virtual assistant interaction completed.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred.' });
  } finally {
    await browser.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
