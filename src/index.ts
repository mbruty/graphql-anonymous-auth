import { ApolloServer } from "apollo-server-express";
import { config } from "dotenv";
import { connect } from "mongoose";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import authMiddleware from "./auth/authMiddleware";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const cookieParser = require("cookie-parser");
const express = require("express");

config();

async function startServer() {
  await connect(process.env.mongo_conn_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await server.start();

  const app = express();
  app.use(cookieParser());

  // app.use((req, res, next) => {
  //   res.set("Access-Control-Allow-Origin", req.get("origin"));
  //   res.set("Access-Control-Allow-Credentials", "true");

  //   next();
  // });

  app.use(authMiddleware);

  server.applyMiddleware({
    app,
    cors: { origin: "https://studio.apollographql.com", credentials: true },
  });

  const port = process.env.PORT || 80;
  await new Promise((resolve) => app.listen({ port }, resolve));
  console.log(
    `🚀 Server blasting off at http://localhost:${port}${server.graphqlPath}`
  );
}

startServer();
