// Serve the files on port 3000.
import { app } from './server.mjs';

app.listen(3000, () => {
  console.log('Local development server listening on port 3000!\n');
});
