const humps = require('humps');
const uuid = require('uuid');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const {ValidationError} = require('lib/errors');
const {generateJWTforUser} = require('lib/utils');

module.exports = {
  async get (ctx) {
    const user = generateJWTforUser(ctx.state.user);

    ctx.body = {user}
  },

  async post (ctx) {
    const {body} = ctx.request;
    let {user = {}} = body;
    const opts = {abortEarly: false, context: {validatePassword: true}};

    user.id = uuid();

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(user.password, salt);

    user.password = await hash;

    await ctx.app.db('users').insert(humps.decamelizeKeys(user));

    user = generateJWTforUser(user);

    ctx.body = {user: _.omit(user, ['password'])};
  },

  async put (ctx) {
    const {body} = ctx.request;
    let {user: fields = {}} = body;
    const opts = {abortEarly: false, context: {validatePassword: false}};

    if (fields.password) {
      opts.context.validatePassword = true;
    }

    let user = Object.assign({}, ctx.state.user, fields);
    user = await ctx.app.schemas.user.validate(user, opts);

    if (fields.password) {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(user.password, salt);

      user.password = await hash;
    }

    user.updatedAT = new Date().toISOString();

    await ctx.app.db('users')
      .where({id: user.id})
      .update(humps.decamelizeKeys(user));

    user = generateJWTforUser(user);

    ctx.body = {user: _.omit(user, ['password'])};
  },

  async login (ctx) {
    const {body} = ctx.request;

    if (!_.isObject(body.user) || !body.user.username || !body.user.password) {
      ctx.throw(
        422,
        new ValidationError(['is invalid'], '', 'username or password')
      );
    }

    let user = await ctx.app.db('users')
      .first()
      .where({username: body.user.username});

    if (!user) {
      ctx.throw(
        422,
        new ValidationError(['is invalid'], '', 'username or password')
      );
    }

    const isValid = await bcrypt.compareSync(body.user.password, user.password);

    if (!isValid) {
      ctx.throw(
        422,
        new ValidationError(['is invalid'], '', 'username or password')
      );
    }

    user = generateJWTforUser(user);

    ctx.body = {user: _.omit(user, ['password'])};
  }

}
