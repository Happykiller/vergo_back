import { version } from '../../package.json';
import { Configuration } from '@src/config/configuration';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv').config().parsed;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenvlocal = require('dotenv').config({
  path: `.env.local`,
  override: true,
}).parsed;

const merged = Object.assign({}, dotenv, dotenvlocal);

const defaults: Configuration = {
  version,
  env: {
    mode: 'defaults',
    port: parseInt(merged.APP_PORT) || 3000,
  },
  graphQL: {
    schemaFileName: true,
    playground: true,
    introspection: true,
    installSubscriptionHandlers: true,
  },
  jwt: {
    refreshTokenName: 'vergo-refresh-token',
    secret: 'secretKey',
    signOptions: {
      expiresIn: '8h',
    },
  },
  puppet: {
    url: 'http://localhost',
    token: 'token'
  },
  db: {
    connection_string:
      merged.DB_CONN_STRING || 'mongodb://root:password@localhost:27017/',
    name: merged.DB_NAME || 'vergo',
  },
  throttle: [
    {
      ttl: 60000,
      limit: 10,
    },
  ],
};

export { defaults };
