const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    if (pathname === "/mainPage") {
      app.render(req, res, "/mainPage", query);
    } else if (pathname === "/signup") {
      app.render(req, res, "/signup", query);
    } else if (pathname === "/publicPortal") {
      app.render(req, res, "/publicPortal", query);
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
