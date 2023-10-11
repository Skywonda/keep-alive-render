require('dotenv').config();
const cron = require('node-cron');
const axios = require('axios');
const express = require('express');
const app = express();

const URLs = process.env.URLS.split(',');

const CronExpression = {
  EVERY_14_MINUTES: '*/14 * * * *',
  EVERY_10_MINUTES: '*/10 * * * *',
  EVERY_5_SEC: '*/5 * * * * *'
};

app.get('/keep-alive', (req, res) => {
  res.status(200).send('Server is active.');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

cron.schedule(CronExpression.EVERY_10_MINUTES, async () => {
  await Promise.all(URLs.map((url) => getHealth(url)));
});

async function getHealth(URL) {
  try {
    const res = await axios.get(URL);
    console.log('🚀 ~ file: index.js:19 ~ res.data:', res.data);
    return res.data;
  } catch (error) {
    console.log('🚀 ~ file: index.js:23 ~ error:', error);
  }
}
