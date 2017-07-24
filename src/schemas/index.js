const user = require('./user-schema')
const article = require('./article-schema')
const comment = require('./comment-schema')

module.exports = function (app) {
  app.schemas = {
    user,
    article,
    comment
  }
}
