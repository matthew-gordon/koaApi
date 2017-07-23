const koaJwt = require('koa-jwt');
const {jwtSecret} = require('config');

// https://github.com/koajs/jwt

module.export = koaJwt({
  getToken (ctx, opts) {
    const {authorization} = ctx.header;

    if (authorization && authorization.split(' ')[0] === 'Bearer') {
      return authorization.split(' ')[1];
    }

    if (authorization && authorization.split(' ')[0] === 'Token') {
      return authorization.split(' ')[1];
    }

    return null;
  },
  secret: jwtSecret,
  passthrough: true,
  key: 'jwt'
});
