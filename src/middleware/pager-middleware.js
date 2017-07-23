const qs = require('qs')

// const filter = ['tag', 'author', 'favorited']

module.exports = (ctx, next) => {
  if (ctx.method !== 'GET') {
    return next()
  }

  ctx.query = qs.parse(ctx.querystring)

  const {query} = ctx

  query.limit = parseInt(query.limit, 10) || 20
  query.skip = query.offset = parseInt(query.offet, 10) || 0

  return next()
}
