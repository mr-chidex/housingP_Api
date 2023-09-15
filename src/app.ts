import express from 'express';
import 'dotenv/config';
import 'reflect-metadata';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from '@apollo/server';

import { UserResolver } from './resolvers/user';
// import morgan from 'morgan';

const app = express();
app.disable('x-powered-by');
// app.use(morgan('dev'));

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 8000;

app.get('/', (_req, res) => res.json({ message: 'Hello', author: 'mr-chidex' }));

(async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const apolloServer = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (error) => {
      // Customize error formatting here
      return {
        message: error.message,
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      };
    },
  });

  await apolloServer.start();

  app.use(
    '/api/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    express.urlencoded({ extended: true }),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );

  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}/api/graphql`);
})();

export default app;
