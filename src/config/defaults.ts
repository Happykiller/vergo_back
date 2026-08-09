import { version } from '../../package.json';
import { Configuration } from '@src/config/configuration';

const dotenv = require('dotenv').config().parsed;

const dotenvlocal = require('dotenv').config({
  path: `.env.local`,
  override: true,
}).parsed;

const merged = Object.assign({}, dotenv, dotenvlocal);

const defaults: Configuration = {
  app_name: 'vergo',
  version,
  env: {
    mode: 'defaults',
    port: parseInt(merged.APP_PORT) || 3000,
  },
  graphQL: {
    schemaFileName: true,
    playground: false,
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
    url: merged.PUPPET_URL || 'http://localhost',
    token: merged.PUPPET_TOKEN || 'token',
  },
  db: {
    connection_string: merged.DB_CONN_STRING || 'mongodb://root:password@localhost:27017/',
    name: merged.DB_NAME || 'vergo',
  },
  morgans: {
    url: merged.MORGANS_URL || 'http://localhost:8025/graphql',
  },
  throttle: [
    {
      ttl: 60000,
      limit: 10,
    },
  ],
};

export { defaults };
