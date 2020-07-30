const fs = require('fs');
const path = require('path');

const generateLambda = (headers) =>
  `exports.handler = (event, context, callback) => {
  const { request, response } = event.Records[0].cf;
  const { uri } = request;
  const { headers } = response;
  const rewrite = uri.includes('login') || uri.includes('logout');

  ${headers.join('\n\t')};

  const rewriteResponse = {
    status: '200',
    statusDescription: 'OK',
    headers: {
      ...headers,
      'content-type': [{ key: 'Content-Type', value: 'text/plain' }],
      'content-encoding': [
        {
          key: 'Content-Encoding',
          value: 'UTF-8'
        }
      ]
    },
    body: \` This is not a real route. If you are seeing this, you most likely are accessing the custom application\\n
directly from the hosted domain. Instead, you need to access the custom application from within the Merchant Center\\n
domain, as custom applications are served behind a proxy router.\\n
To do so, you need to first register the custom application in Merchant Center > Settings > Custom Applications.\`
  };

  callback(null, rewrite ? rewriteResponse : response);
};`;

// This transformer will generate a `lambda.js` config file, based on the application
// environment config and custom headers.
module.exports = ({ headers }) => {
  const setHeaders = Object.entries({
    ...headers,
    'Cache-Control': 'no-cache',
  }).map(
    ([key, value]) =>
      `headers["${key.toLowerCase()}"] = [{key: "${key}", value: "${value}"}];`
  );

  fs.writeFileSync(
    path.join(__dirname, '../lambda.js'),
    generateLambda(setHeaders),
    {
      encoding: 'utf8',
    }
  );
};
