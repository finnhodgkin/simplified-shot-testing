const fs = require('fs');
const path = require('path');

const handler = module.exports = {};

handler.serveStatic = (req, res, page) => {

  const filePath = path.join(__dirname, '..', 'public', page);
  const pageContents = fs.createReadStream(filePath);
  
  pageContents.on('open', () => {
    pageContents.pipe(res);
  });

  let headerNotSet = true;
  pageContents.on('data', () => {
    if (headerNotSet) {
      res.writeHead(200, {'content-type':'text/html'});
      headerNotSet = false;
    }
  });

  pageContents.on('error', (err) => {
    handler.serveError(req, res, err);
  });

};

handler.search = (req, res) => {

};

handler.cool = (req, res) => {

};

handler.servePublic = (req, res) => {

};

handler.serveError = (req, res, error) => {
  res.writeHead(404, {'content-type':'text/html'});

  if (error) {
    console.log(error.message);
  }

  res.end(`Error 404: ${req.url} not found.`);
};
