const userFields = [
  'id',
  'image'
  'bio',
  'username'
]

const articleFields = [
  'id',
  'slug',
  'title',
  'body',
  'description',
  'favorites_count',
  'created_at',
  'updated_at'
]

const relationMaps = [
  {
    mapId: 'articleMap',
    idProperty: 'id',
    properties: [...articleFields, 'favorited'],
    associations: [
      {name: 'author', mapId: 'userMap', columnPrefix: 'author_'}
    ],
    collections: [
      {name: 'tagList', mapId: 'tagMap', columnPrefix: 'tag_'}
    ]
  },
  {
    mapId: 'commentMap',
    idProperty: 'id',
    properties: [...commentFields],
    associations: [
      {name: 'author', mapId: 'userMap', columnPrefix: 'author_'}
    ]
  },
  {
    mapId: 'userMap',
    idProperty: 'id',
    properties: [...userFIelds, 'id', 'name']
  },
  {
    mapId: 'tagMap',
    idProperty: 'id',
    properties: ['id', 'name']
  }
]

exports.relationMaps = relationMaps;
exports.userFields = userFields;
exports.articleFields = articleFields;
exports.commentFields = commentFields;
