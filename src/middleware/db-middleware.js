const config = require('config');
const fs = require('fs');

module.exports = function (app) {
  const db = require('knex')(config.db)
  app.db = db;
  let promise;

  if (!config.env.isTest) {
    app.migration = true;
    promise = db.migrate.latest()
      .then(() => { app.migration = false }, console.error)
  }

  return async function (ctx, next) {
    if (ctx.app.migration && promise) {
      await promise;
    }

    return next();
  }
}
