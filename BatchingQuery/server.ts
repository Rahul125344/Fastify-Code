import fastify from "fastify";
import { getGraphQLParameters, processRequest, renderGraphiQL, sendResult, shouldRenderGraphiQL } from "graphql-helix";
import { schema } from "./schema";
import fastifyCors from "@fastify/cors";

const app = fastify();

app.register(fastifyCors, {
  origin: 'http://localhost:3000',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",

});

app.route({
  method: ["GET", "POST"],
  url: "/graphql",
  async handler(req, res) {
    const request = {
      body: req.body,
      headers: req.headers,
      method: req.method,
      query: req.query,
    };

    if (shouldRenderGraphiQL(request)) {
      res.type("text/html");
      res.send(renderGraphiQL({}));
    } else {
      const request = {
        body: req.body,
        headers: req.headers,
        method: req.method,
        query: req.query,
      };
      const { operationName, query, variables } = getGraphQLParameters(request);
      const result = await processRequest({
        operationName,
        query,
        variables,
        request,
        schema,
      });

      sendResult(result, res.raw.setHeader('Access-Control-Allow-Origin', '*'));
    }
  },
});

const port = 4000;

app.listen({port:port}, () => {
  console.log(`GraphQL server is up and running at http://localhost:${port}/graphql.`);
});