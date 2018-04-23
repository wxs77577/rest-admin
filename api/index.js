const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const _ = require('lodash')
const faker = require('faker')

const config = {
  primaryKey: '_id'
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.send({
    welcome: 'Test api for rest-admin is running.'
  })
})

const router = express.Router()

app.use((req, res, next) => {
  // cors
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Authorization,Content-Type,X-Requested-With')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

// for basic site config
router.get('/site', (req, res) => res.send({
  name: 'Awesome', //site name
  menu: [ //site menu
    {
      name: 'Home',
      url: '/',
      icon: 'icon-home',
    },
    {
      name: 'Content',
      title: true,
    },
    {
      name: 'Users',
      url: '/rest/users',
      icon: 'icon-user',
    },
    {
      name: 'Posts',
      url: '/rest/posts',
      icon: 'icon-list',
    },
    {
      name: 'Categories',
      url: '/rest/categories',
      icon: 'icon-list',
    },
    {
      name: 'System',
      title: true,
    },
    {
      "name": "Settings",
      "url": "/form?uri=site/settings",
      "icon": "icon-settings",
      // a custom form.
    },
    {
      name: 'Logout',
      url: '/login',
      icon: 'icon-lock',
    },
  ]
}))

// for home page
router.get('/home', (req, res) => res.send({ name: 'Awesome' }))

router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (username == 'admin' && password == 'admin') {
    res.send({
      user: { username, password },
      token: 'fake token'
    })
  } else {
    res.status(422).send({
      msg: 'Username or password is incorrect.'
    })
  }
})

router.post('/upload', (req, res) => {
  let url = faker.image.avatar()
  switch (req.body.type) {
    case 'image':
      url = faker.image.image(320, 140)
      break
  }
  res.send({
    url
  })
})

router.get('/site/settings', (req, res) => {
  res.send({
    title: "App Settings",
    fields: {
      name: { label: "Site Name", input_cols: 4},
      logo: { label: "Site Logo", type: "image", input_cols: 4 },
    }
  })
})

/**
* CRUD for Resources
*/

const resources = require('./resources')

const resourceRouter = express.Router()


// user list data
resourceRouter.get('/', ({ resource, query }, res) => {
  const queryObject = JSON.parse(query.query || '{}')
  const { page = 1, perPage = 10, sort = {}, where = null } = queryObject

  let data = resource.data
  if (sort) {
    data = _.orderBy(
      resource.data,
      Object.keys(sort),
      Object.values(sort).map(v => v == -1 ? 'desc' : 'asc')
    )
  }
  if (where) {
    data = _.filter(data, row => {
      let isMatch = true
      for (let key in where) {
        const value = row[key]
        const search = where[key]
        if (_.isString(value)) {
          isMatch = isMatch && new RegExp(search, 'i').test(value)
        } else {
          isMatch = isMatch && value == search
        }
      }
      return isMatch
    })
  }

  res.send({
    total: data.length,
    perPage,
    page,
    data: data.slice((page - 1) * perPage, page * perPage)
  })
})

// data table config for listing users
resourceRouter.get('/grid', ({ resource }, res) => {
  res.send({
    searchModel: {},
    searchFields: _.pickBy(resource.fields, (v, k) => {
      return v.searchable === true
    }),
    fields: _.pickBy(resource.fields, (v, k) => {
      return v.listable !== false
    })
  })
})

// data FORM config for editing an user
resourceRouter.get('/form', ({ resource }, res) => {
  res.send({
    fields: _.pickBy(resource.fields, (v, k) => {
      return v.editable !== false && !['_id', 'created_at', 'updated_at'].includes(k)
    })
  })
})

// single user data
resourceRouter.get('/:id', ({ resource, params }, res) => {
  const model = resource.data.find(v => v[config.primaryKey] == params.id)
  res.send(model)
})

// update
resourceRouter.put('/:id', ({ resource, params, body }, res) => {
  let i = resource.data.findIndex(v => v[config.primaryKey] == params.id)
  resource.data[i] = body
  res.send(resource.data[i])
})

// create
resourceRouter.post('/', ({ resource, body }, res) => {
  resource.data.push(body)
  res.send(resource.data[resource.data.length - 1])
})

// delete
resourceRouter.delete('/:id', ({ resource, params }, res) => {
  let i = resource.data.findIndex(v => v[config.primaryKey] == params.id)
  resource.data.splice(i, 1)
  res.send({
    success: true
  })
})
// delete all
resourceRouter.delete('/', ({ resource }, res) => {
  resource.data.splice(0)
  res.send({
    success: true
  })
})


router.use('/:resource', (req, res, next) => {
  req.resource = resources[req.params.resource] || {}
  next()
}, resourceRouter)


app.use('/admin/api', router)

app.listen(8088, () => {
  console.log('Test API is listening at http://localhost:8088')
})