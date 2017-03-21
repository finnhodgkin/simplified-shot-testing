
const router = (req, res) => {

  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, {'content-type':'text/html'});
    res.end('hello');

  } else {
    res.writeHead(404, {'content-type':'text/html'});
    res.end();

  }
};

module.exports = router;
