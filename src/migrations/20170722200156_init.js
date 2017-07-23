exports.up = function (knex) {
  return knex.schema

  .createTable('users', (table) => {
    table.uuid('id').unique().primary().notNullable()
    table.string('email').unique().notNullable()
    table.string('username').unique().notNullable()
    table.string('image').defaultTo('')
    table.text('bio').defaultTo('')
    table.string('password').notNullable()
    table.timestamps(true, true)
  })

  .createTable('articles', (table) => {
    table.uuid('id').unique().primary().notNullable()
    table.string('slug').unique().notNullable()
    table.string('title').notNullable()
    table.text('body').notNullable()
    table.string('description').notNullable()
    table.integer('favorites_count').notNullable().defaultTo(0)
    table.uuid('author').notNullable().references('user.id')
      .onDelete('CASCADE')
    table.timestamps(true, true)
  })

  .createTable('comments', (table) => {
    table.uuid('id').unique().primary().notNullable()
    table.text('body').notNullable()
    table.uuid('author').notNullable().references('users.id')
      .onDelete('CASCADE')
    table.uuid('article').notNullable().references('articles.id')
      .onDelete('CASCADE')
    table.timestamps(true, true)
  })

  .createTable('favorites', (table) => {
    table.uuid('id').unique().notNullable()
    table.uuid('user').notNullable().references('users.id')
      .onDelete('CASCADE')
    table.uuid('article').notNullable().references('articles.id')
      .onDelete('CASCADE')
    table.timestamps(true, true)
  })

  .createTable('followers', (table) => {
    table.uuid('id').unique().primary().notNullable()
    table.uuid('user').notNullable().references('users.id')
      .onDelete('CASCADE')
    table.uuid('follower').notNullable().references('users.id')
      .onDelete('CASCADE')
    table.unique(['user', 'follower'])
    table.timestamps(true, true)
  })

  .createTable('tags', (table) => {
    table.uuid('id').unique().primary().notNullable()
    table.string('name').unique().notNullable()
    table.timestamps(true, true)
  })

  .createTable('articles_tags', (table) => {
    table.uuid('id').unique().primary().notNullable()
    table.uuid('article').notNullable().references('articles.id')
      .onDelete('CASCADE')
    table.uuid('tag').notNullable().references('tags.id')
      .onDelete('CASCADE')
    table.unique(['tag', 'article'])
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('articles')
    .dropTableIfExists('comments')
    .dropTableIfExists('followers')
    .dropTableIfExists('favorites')
    .dropTableIfExists('tags')
    .dropTableIfExists('articles_tags')
}
