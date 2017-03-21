const _url = require('url');
const handler = require('./handler');


const router = (req, res) => {
  const url = req.url;
  const urlParts = _url.parse(url);

  const page = {
    '/':'index.html',
    '/test':'test1.html',
    '/test2':'test2.html',
    '/test3':'test3.html',
  }[url];

  const api = {
    '/search':handler.search,
    '/coolApi':handler.cool,
  }[url.pathname];

  // ROUTES:
  if (page) {
    handler.serveStatic(req, res, page);

  } else if (api) {
    api(req, res);

  } else if (url.indexOf('/public') === 0) {
    handler.servePublic(req, res);

  } else {
    handler.serveError(req, res);

  }
};

module.exports = router;
