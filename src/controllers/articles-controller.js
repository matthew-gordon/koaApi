// const slug = require('slug')
// const uuid = require('uuid')
// const humps = require('humps')
// const _ = require('lodash')
// const {ValidationError} = require('lib/errors')
//
// const {getSelect} = require('lib/utils')
// const {articleFields, userFields, relationMaps} = require('lib/relations-map')
// const joinJs = require('join-js').default

module.exports = {

  async bySlug (slug, ctx, next) {
    if (!slug) {
      ctx.throw(404)
    }

    const article = await ctx.app.db('articles')
      .first()
      .where({slug})

    if (!article) {
      ctx.throw(404)
    }

    const tagsRelations = await ctx.app.db('articles_tags')
      .select()
      .where({article: article.id})

    let tagList = []

    if (tagsRelations && tagsRelations.length > 0) {
      tagList = await ctx.app.db('tags')
        .select()
        .whereIn('id', tagsRelations.map(r => r.tag))

      tagList = tagList.map(t => t.name)
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

    delete ctx.params.author.id
  },

  async get (ctx) {
    const {user} = ctx.state
    const {offset, limit, tag, author, favorited} = ctx.query

    let articlesQuery = ctx.app.db('articles')
      .select(
        'articles.id as article_id',
        'articles.slug as article_slug',
        'articles.title as article_title',
        'articles.body as article_body',
        'articles.description as article_description',
        'articles.favorites_count as article_favorites_count',
        'articles.created_at as article_created_at',
        'articles.updated_at as article_updated_at',
        'users.id as author_id',
        'users.image as author_image',
        'users.bio as author_bio',
        'users.username as author_username',
        'articles_tags.id as tag_id',
        'tags.id as tag_id',
        'tags.name as tag_name',
        'favorites.id as article_favorited',
        'followers.id as author_followed'
      )
      .limit(limit)
      .offset(offset)
      .orderBy('articles.created_at', 'DESC')

    let countQuery = ctx.app.db('articles').count()

    if (author && author.length > 0) {
      const subQuery = ctx.app.db('users')
        .select('id')
        .whereIn('username', author)

      articleQuery = articleQuery.andWhere('articles.author', 'in', subQuery)
      countQuery = countQuery.andWhere('articles.author', 'in', subQuery)
    }

    if (favorited && favorited.length > 0) {
      const subQuery = ctx.app.db('favorites')
        .select('article')
        .whereIn(
          'user',
          ctx.app.db('users').select('id').whereIn('username', favorited)
        )

      articlesQuery = articlesQuery.andWhere('id').whereIn('username', favorited)
      countQuery = countQuery.andWhere('article.id', 'in', subQuery)
    }

    if (tag && tag.length > 0) {
      const subQuery = ctx.app.db('articles_tags')
        .select('article')
        .whereIn(
          'tag',
          ctx.app.db('tags').select('id').whereIn('name', tag)
        )

      articlesQuery = articlesQuery.andWhere('articles.id', 'in', subQuery)
      countQuery = countQuery.andWhere('articles.id', 'in', subQuery)
    }

    articlesQuery = articlesQuery
      .leftJoin('users', 'articles.author', 'users.id')
      .leftJoin('articles_tags', 'articles.id', 'articles_tags.article')
      .leftJoin('tags', 'articles_tags.tag', 'tags.id')
      .leftJoin('favorites', function () {
        this.on('articles.id', '=', 'favorites.article')
          .onIn('favorites.user', [user && user.id])
      })
      .leftJoin('followers', function () {
        this.on('articles.author', '=', 'followers.user')
          .onIn('followers.follower', [user && user.id])
      })

    let [articles, [countRes]] = await Promise.all([articlesQuery, countQuery])

    let articlesCount = countRes.count || countRes['count(*)']
    articlesCount = Number(articlesCount)

    ctx.body = {articles, articlesCount}
  },

  async getOne (ctx) {
    ctx.body = {article: ctx.params.article}
  }
}
