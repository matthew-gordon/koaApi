const config = require('./src/config');
const http = require('http');
const Koa = require('koa');

const app = new Koa();

const responseTime = require('koa-response-time');
const helmet = require('koa-helmet');
const logger = require('koa-logger');
const cors = require('kcors');
const bodyParser = require('koa-bodyparser');

// MIDDLEWARE
const db = require('./src/middleware/db-middleware');

app.use(logger());

app.use(cors());
app.use(db(app));
app.use(bodyParser());

app.server = require('http-shutdown')(http.createServer(app.callback()));

app.shutDown = function shutDown () {
  let err;

  console.log('Shutdown');

  if (this.server.listening) {
    this.server.shutdown(error => {
      if (error) {
        console.error(error);
        err = error
      }

      this.db.destroy()
        .catch(error => {
          console.error(error);
          err = error;
        })
        .then(() => process.exit(err ? 1 : 0));

    });
  }
}

module.exports = app;
