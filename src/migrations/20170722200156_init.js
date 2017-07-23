
exports.up = function(knex, Promise) {
  return knex.schema

  .createTable('users', (table) => {
  });

  .createTable('articles', (table) => {
  });

  .createTable('comments', (table) => {
  });

  .createTable('favorites', (table) => {
  });

  .createTable('followers', (table) => {
  });

  .createTable('tags', (table) => {
  });

  .createTable('articles_tags', () => {
  });

};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists(users);
};
