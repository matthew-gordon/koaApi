const user = require('./user-schema')
const article = require('./article-schema')

module.exports = function (app) {
  app.schemas = {
    user,
    article
  }
}
