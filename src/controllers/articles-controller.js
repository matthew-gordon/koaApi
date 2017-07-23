const slug = require('slug')
const uuid = require('uuid')
const humps = require('humps')
const _ = require('lodash')
const {ValidationError} = require('lib/errors')

const {getSelect} = require('lib/utils')
const {articleFields, userFields, relationMaps} = require('lib/relations-map')
const joinJs = require('join-js').default

module.exports = {
  async bySlug (slug, ctx, next) {
    if (!slug) {
      ctx.throw(404)
    }

    const article = await ctx.app.db('articles')
      .first()
      .where({slug})

      if(!article) {
        ctx.throw(404)
      }

    const tagsRelations = await ctx.app.db('articles_tags')
      .select()
      .where({article: article.id})

    let tagList = [];

    if (tagsRelations && tagsRelations.length > 0) {
      tagList = await ctx.app.db('tags')
        .select()
        .whereIn('id', tagsRelations.map(relation => relation.tag))

      tagList = tagList.map(tag => tag.name)
    }

    article.tagList = tagList

    article.favorited = false

    const author = await ctx.app.db('users')
      .first('username', 'bio', 'image', 'id')
      .where({id: article.author})

    article.author = author

    article.author.following = false

    const {user} = ctx.state

    if (user && user.username !== article.author.username) {
      const res = await ctx.app.db('followers')
        .where({user: article.author.id, follower: user.id})
        .select()

      if (res.length > 0) {
        article.author.following = true
      }
    }

    let favorites = []

    if (user) {
      favorites = await ctx.app.db('favorites')
        .where({user: user.id, article: article.id})
        .select()

      if (favorites.length > 0) {
        article.favorited = true
      }
    }

    ctx.params.article = article
    ctx.params.favorites = favorites
    ctx.params.author = author
    ctx.params.tagList = tagList
    ctx.params.tagsRelations = tagsRelations

    await next()
  },

  async getOne (ctx) {
    ctx.body = {article: ctx.params.article}
  }
}
