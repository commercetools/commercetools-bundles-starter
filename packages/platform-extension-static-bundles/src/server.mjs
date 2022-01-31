/**
 * Local development server
 */
import express from 'express';
import bodyParser from 'body-parser';
import handler from './index.js';

// eslint-disable-next-line import/prefer-default-export
export const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("POST an event's payload to /.");
});

app.post('/', async (req, res) => {
  if (!req.body) {
    return res.send('No body POSTed.');
  }
  try {
    const result = await handler(req.body);
    res.send(result);
  } catch (e) {
    res.sendStatus(500).send(e);
  }
});

export const server = app.listen(process.env.PORT || 3000, () => {
  console.info('Local development server started and listening on port:', process.env.PORT || 3000);
});
