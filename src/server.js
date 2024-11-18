import http from "node:http";
import { routes } from "./routes.js";
import { json } from "./middlewares/json.js";
import { extractQueryParams } from "./utils/extract-query-prams.js";

const PORT = 3333;

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParam = req.url.match(route.path);
    const { query, ...params } = routeParam.groups;
    req.params = params;
    req.query = query ? extractQueryParams(query) : {};
    return route.handler(req, res);
  }

  return res.writeHead(404).end("Route not found");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
