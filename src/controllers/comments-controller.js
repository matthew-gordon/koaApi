const humps = require('humps')
const uuid = require('uuid')
const _ = require('lodash')
// const {getSelect} = require('lib/utils')
const {commentFields, userFields, relationsMaps} = require('lib/relations-map')
const joinJs = require('join-js').default

module.exports = {

  async byComment (comment, ctx, next) {
    if (!comment) {
      ctx.throw(404)
    }

    comment = await ctx.app.db('comments').first().where({id: comment})

    if (!comment) {
      ctx.throw(404)
    }

    ctx.params.comment = comment

    return next()
  },

  async get (ctx) {
    const {user} = ctx.state
    const {article} = ctx.params

    let comments = await ctx.app.db('comments')
      .select(
        'comments.id as comment_id',
        'comments.body as comment_body',
        'comments.created_at as comment_created_at',
        'comments.updated_at as comment_updated_at',
        'users.id as author_id',
        'users.image as author_image',
        'users.bio as author_bio',
        'users.username as author_username',
        'followers.id as author_following'
      )
      .where({article: article.id})
      .leftJoin('users', 'comments.author', 'users.id')
      .leftJoin('followers', function() {
        this
          .on('users.id', '=', 'followers.user')
          .onIn('followers.follower', [user && user.id])
      })

    comments = joinJs
      .map(comments, relationsMaps, 'commentMap', 'comment_')
      .map(comment => {
        delete comment.author.id
        comment.author.following = Boolean(comment.author.following)
        return comment
      })

    ctx.body = {comments}
  }
}
