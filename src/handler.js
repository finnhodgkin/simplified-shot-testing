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
      res.writeHead(200, {'Content-Type':'text/html'});
      headerNotSet = false;
    }
  });

  pageContents.on('error', (err) => {
    handler.serveError(req, res, err);
  });

};

handler.search = (req, res) => {
  res.writeHead(200, {'Content-Type':'application/json'});
  res.end();
};

handler.cool = (req, res) => {
  res.writeHead(200, {'Content-Type':'application/json'});
  res.end();
};

handler.servePublic = (request, response) => {
  const url = request.url;
  const extension = url.split('.')[1];
  const extensionType = {
    'css':'text/css',
    'js':'application/javascript',
    'ico':'image/x-icon',
    'jpg':'image/jpeg',
    'png':'image/png',
    'gif':'image/gif'
  };

  console.log(extensionType[extension]);

  if (extensionType[extension]) {
    const readStream = fs.createReadStream(path.join(__dirname, '..', 'public', url));

    let headerNotSet = true;
    readStream.on('data', () => {
      if (headerNotSet) {
        response.writeHead(200, {'Content-Type':extensionType[extension]});
        readStream.pipe(response);
        headerNotSet = false;
      }
    });

    readStream.on('error', (err) => {
      handler.serveError(request, response, err);
    });

  } else {
    handler.serveError(request, response, new Error(`Incorrect Content-Type: ${extension || 'none'}`));
  }
};

handler.serveError = (req, res, error) => {
  res.writeHead(404, {'Content-Type':'text/html'});

  if (error) {
    console.log(error.message);
  }

  res.end(`Error 404: ${req.url} not found.`);
};
