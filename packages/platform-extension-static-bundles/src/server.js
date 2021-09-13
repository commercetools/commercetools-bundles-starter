/**
 * Local development server
 */
import express from 'express';
import bodyParser from 'body-parser';
import { handler } from './index';

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("POST an event's payload to /.");
});

app.post('/', (req, res) => {
  if (!req.body) {
    return res.send('No body POSTed.');
  }
  try {
    const result = handler(req.body);
    res.send(result);
  } catch (e) {
    res.sendStatus(500).send(e);
  }
});

// Serve the files on port 3000.
app.listen(3000, () => {
  console.log('Local development server listening on port 3000!\n');
});
