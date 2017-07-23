const {jwtSecret, jwtOptions} = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

function generateJWTforUser (user = {}) {
  return Object.assign({}, user, {
    token: jwt.sign({
      sub: _pick(user, ['id', 'email', 'username'])
    }, jwtSecret, jwtOptions)
  })
}

function getSelect (table, prefix, fields) {
  return fields.map(field => `${table}.${field} as ${prefix}.${field}`);
}

exports.generateJWTforUser = generateJWTforUser;
exports .getSelect = getSelect;
