const user = require('./user-schema')

module.exports = function (app) {
  app.schemas = {
    user
  }
}
