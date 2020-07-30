const fs = require('fs');
const path = require('path');

// This transformer will generate a `firebase.json` config file, based on the application
// environment config and custom headers. If you are deploying to a Firebase project with multiple
// sites, set the FIREBASE_TARGET environment variable to match the host created with
// `firebase target:apply hosting target-name resource-name`
module.exports = ({ headers }) => {
  const config = {
    hosting: {
      public: 'public',
      ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
      rewrites: [
        { source: '/@(login|logout)', function: 'customAppFallback' },
        {
          source: '**',
          destination: '/index.html',
        },
      ],
      headers: [
        {
          source: '**/*.@(js.map|js|css|txt|html|png)',
          headers: [
            {
              key: 'Cache-Control',
              value: 's-maxage=31536000,immutable',
            },
          ],
        },
        {
          source: '**',
          headers: Object.entries({
            ...headers,
            'Cache-Control': 'no-cache',
          }).map(([key, value]) => ({
            key,
            value,
          })),
        },
      ],
    },
  };

  const target = process.env.FIREBASE_TARGET;

  if (target) {
    config.hosting.target = target;
  }

  fs.writeFileSync(
    path.join(__dirname, '../firebase.json'),
    JSON.stringify(config, null, 2),
    { encoding: 'utf8' }
  );
};
