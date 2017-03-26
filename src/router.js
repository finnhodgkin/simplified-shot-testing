const _url = require('url');
const handler = require('./handler');


const router = (req, res) => {
  const url = req.url;
  const pathname = _url.parse(url).pathname;

  const page = {
    '/':'index.html',
    '/brokenurl':'test1.html',
    '/me':'me.html',
    '/test3':'test3.html',
  }[url];

  const api = {
    '/search':handler.search,
    '/coolApi':handler.cool,
  }[pathname];

  // ROUTES:
  if (page) {
    handler.serveStatic(req, res, page);

  } else if (api) {
    api(req, res);

  } else if (url.indexOf('/assets') === 0) {
    handler.servePublic(req, res);

  } else {
    handler.serveError(req, res);

  }
};

module.exports = router;
