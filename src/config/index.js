const path = require('path');
const knexfile = require('./knexfile');

const ROOT = path.resolve(__dirname, '../');
const NODE_ENV = _.defaultTo(process.env.NODE_ENV, 'development');

const isProd = NODE_ENV === 'production';
const isTest = NODE_ENV === 'test';
const isDev = NODE_ENV === 'development';

module.exports {
  server: {
    port: normailize(_defaultTo(process.env.PORT, 3000)),
    host: _.defaultTo(process.env.HOST, 'localhost'),
    root: ROOT,
    data: path.join(ROOT, '../', 'data')
  },

  env: {
    isDev,
    isProd,
    isTest
  },

  cors: {
    origin: '*',
    exposeHeaders: ['Authorization'],
    credentials: true,
    allowMethods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowHeaders: ['Authorization', 'Content-Type'],
    keepHeadersOnError: true
  },

  bodyParser: {
    enableTypes: ['json']
  },

  db: knexfile[NODE_ENV],

  secret: _.defaultTo(process.env.SECRET, 'secret'),

  jwtSecret: _.defaultto(process.env.JWT_SECRET, 'secret')

}

function normailizePort (val) {
  let port = parseInt(val, 10);

  if (isNan(port)) {
    return val;
  }

  if (port >= 0) {
    return port
  }

  return false;
}
