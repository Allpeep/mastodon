
const http = require('http');
const httpProxy = require('@tgrx/http-proxy');

const proxy = httpProxy.createProxyServer({ ws: true, secure: false });

const parseRequestUrl = (req) => {
  const [, prefix, jamHost, jamPath] = req.url.match(/(\/jam-proxy\/([^\/]*))(\/.*)/);
  return { prefix, jamHost, jamPath };
};

proxy.on('proxyReq', function(proxyReq, req) {
  proxyReq.setHeader('host', req.host);
});

const server = http.createServer(function(req, res) {
  const { jamHost, jamPath } = parseRequestUrl(req);
  req.url = jamPath;
  req.host = jamHost;
  proxy.web(req, res, {
    target: {
      protocol: 'https:',
      host: jamHost,
      servername: jamHost,
    },
  });
});

console.log('listening on port 8000');
server.listen(8000);
