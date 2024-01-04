
const http = require('http');
const httpProxy = require('@tgrx/http-proxy');

const proxy = httpProxy.createProxyServer({ secure: false, changeOrigin: true, toProxy: true, ignorePath: true });

const parseRequestUrl = (req) => {
  const [, prefix, jamHost, jamPath] = req.url.match(/(\/jam-proxy\/([^\/]*))(\/.*)/);
  return { prefix, jamHost, jamPath };
};

const requestToTarget = (req) => {
  const { jamHost, jamPath } = parseRequestUrl(req);
  return `https://${jamHost}${jamPath}`;
};


const server = http.createServer(function(req, res) {
  proxy.web(req, res, {
    target: requestToTarget(req),
  });
});

server.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head, {
    target: requestToTarget(req),
  });
});

console.log('listening on port 8000');
server.listen(8000);
