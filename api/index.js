const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const _ = require('lodash')
const faker = require('faker')

const config = require('../src/config.json')

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
  name: 'REST-ADMIN', //site name
  locale: 'en-US',
  locale_switcher: true,
  url: 'https://github.com/wxs77577/rest-admin',
  footer: `
  <span><a href="https://github.com/wxs77577/rest-admin">REST-ADMIN</a> &copy; 2018</span>
  <span class="ml-auto">
    GitHub <a href="https://github.com/wxs77577/rest-admin">REST-ADMIN</a>
  </span>
  <script>
  //Baidu Statistic
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?8ec67f6e612d57c8a9f2e21a32ddf4ff";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
  })();
  </script>
  `,
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
      name: 'Categories',
      url: '/rest/categories',
      icon: 'icon-list',
    },
    {
      name: 'Products',
      url: '/rest/products',
      icon: 'icon-list',
    },
    {
      name: 'Users',
      url: '/rest/users',
      icon: 'icon-user',
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
router.get('/home', (req, res) => res.send({
  title: 'Welcome to REST ADMIN', 
  description: 'Admin dashboard based on vue 2 and bootstrap 4',
  button: {
    icon: 'icon-people',
    variant: 'primary',
    text: 'Users',
    to: '/rest/users'
  },
  statics: [
    {
      bg: 'info',
      icon: 'icon-speedometer',
      value: 5000 + parseInt(Math.random() * 5000),
      title: 'Comments',
      progress: 78
    },
    {
      bg: 'success',
      icon: 'icon-people',
      value: 10000 + parseInt(Math.random() * 10000),
      title: 'Users',
      progress: 60
    },
    {
      bg: 'warning',
      icon: 'icon-basket-loaded',
      value: 100000 + parseInt(Math.random() * 30000),
      title: 'Sales',
      progress: 92
    },
    {
      bg: 'primary',
      icon: 'icon-camrecorder',
      value: 300 + parseInt(Math.random() * 300),
      title: 'Videos',
      progress: 67
    },
  ]
}))

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
      return v.editable !== false && ![config.primaryKey, 'created_at', 'updated_at'].includes(k)
    })
  })
})

// data FORM config for editing an user
resourceRouter.get('/view', ({ resource }, res) => {
  res.send({
    fields: _.pickBy(resource.fields, (v, k) => {
      return v.viewable !== false && ![config.primaryKey, 'created_at', 'updated_at'].includes(k)
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
  resource.data[i] = _.pick(body, Object.keys(resource.fields))
  res.send(resource.data[i])
})

// create
resourceRouter.post('/', ({ resource, body }, res) => {
  const data = _.pick(body, Object.keys(resource.fields))
  data[config.primaryKey] = resources.genId('')
  resource.data.push(data)
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