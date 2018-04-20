const _ = require('lodash')
// also you can use other locales
const faker = require('faker/locale/en')

// 
const categories = {
  data: [],
  fields: {
    _id: { label: 'ID' },
    name: { cols: 6, searchable: true },
    title: { cols: 6 },
    created_at: { label: 'Created At', type: 'datetime' }
  }
}

_.times(15, i => categories.data.push({
  _id: `c${genId(i)}`,
  name: faker.lorem.slug(),
  title: _.upperFirst(faker.lorem.word()),
  created_at: faker.date.recent()
}))

// 
const users = {
  data: [],
  fields: {
    _id: { label: 'ID' },
    username: { label: 'Username', cols: 4, searchable: true },
    password: { listable: false, cols: 4 },
    mobile: { listable: false, cols: 4 },
    avatar: { type: 'image', cols: 6 },
    intro: { type: 'textarea', cols: 6, listable: false },
    created_at: { label: 'Created At', type: 'datetime' }
  }
}

_.times(128, i => users.data.push({
  _id: `a${genId(i)}`,
  username: faker.name.lastName(),
  password: 'admin',
  mobile: faker.phone.phoneNumber(),
  avatar: faker.image.image(120, 120),
  intro: faker.lorem.sentences(),
  created_at: faker.date.recent()
}))

// 
const posts = {
  data: [],
  fields: {
    _id: {},
    category_id: {
      cols: 6, label: 'Category',
      type: 'select', options: buildOptions(categories.data, '_id', 'title'), sortable: true
    },
    title: { cols: 6, searchable: true },
    image: { type: 'image', cols: 6 },
    body: { type: 'html', listable: false },
    is_reviewed: { type: 'switch', cols: 3 },
    views: { type: 'number', cols: 3, listable: false, },
    sort: { type: 'number', cols: 3, sortable: true },
    type: {
      type: 'radiolist', cols: 3, options: [
        { text: 'Article', value: 'article' },
        { text: 'Page', value: 'page' },
      ], searchable: true,
    },

    created_at: { label: 'Created At', type: 'datetime' }
  }
}


_.times(78, i => posts.data.push({
  _id: `b${genId(i)}`,
  category_id: _.sample(categories.data)._id,
  title: faker.lorem.sentence(),
  // image: faker.image.imageUrl(),
  image: faker.image.image(320, 180),
  body: faker.lorem.paragraphs(),
  is_reviewed: Math.random() > 0.2,
  views: parseInt(Math.random() * 1000),
  sort: parseInt(Math.random() * 200),
  type: _.sample(posts.fields.type.options).value,
  created_at: faker.date.recent()
}))

function genId(salt) {
  return Number(new Date(2020, 1, 1).getTime() + salt).toString(16)
}

function buildOptions(data = [], valueField = '_id', titleField = 'title') {
  // { text: 'Please choose...' }
  return data.map(v => {
    return { text: v[titleField], value: v[valueField] }
  })
}


module.exports = { users, posts, categories }