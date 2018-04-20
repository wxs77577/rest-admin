const express = require('express')
const bodyParser = require('body-parser')
const app = express()
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
  res.header('Access-Control-Allow-Headers', '*')
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
      name: 'Users',
      url: '/rest/users',
      icon: 'icon-user',
    },
    {
      name: 'Logout',
      url: '/login',
      icon: 'icon-lock',
    },
  ]
}))

// for home page
router.get('/home', (req, res) => res.send({name: 'Awesome'}))

router.post('/login', (req, res) => {
  const {username, password} = req.body
  if (username == 'admin' && password == 'admin') {
    res.send({
      user: {username, password},
      token: 'fake token'
    })
  } else {
    res.status(422).send({
      msg: 'Username or password is incorrect.'
    })
  }
})

/**
* CRUD for Resources
*/

const resources = {
  users: [],
  posts: [],
}
for (let i = 1; i < 46; i++) {
  resources.users.push({_id: '2018AFEDBC0' + String(i), username: `user${i}`, created_at: new Date})
}

// user list data
router.get('/:resource', (req, res) => {
  const resource = resources[req.params.resource]
  const {page = 1, perPage = 10} = JSON.parse(req.query.query)
  res.send({
    total: resource.length,
    perPage,
    page,
    data: resource.slice((page - 1) * perPage, page * perPage)
  })
})


// data table config for listing users
router.get('/:resource/grid', (req, res) => {
  res.send({
    searchFields: {
      _id: {label: 'ID'},
      username: {label: 'Username'},
    },
    searchModel: {},
    fields: {
      _id: {label: 'ID'},
      username: {label: 'Username'},
      created_at: {label: 'Created At', type: 'datetime'}
    }
  })
})

// data FORM config for editing an user
router.get('/:resource/form', (req, res) => {
  res.send({
    model: {},
    fields: {
      _id: {label: 'ID'},
      username: {label: 'Username'},
      created_at: {label: 'Created At', type: 'datetime'}
    }
  })
})

// single user data
router.get('/:resource/:id', (req, res) => {
  const resource = resources[req.params.resource]
  const model = resource.find(v => v[this.$config.primaryKey] == req.params.id)
  res.send(model)
})

// update
router.put('/:resource/:id', (req, res) => {
  const resource = resources[req.params.resource]  
  let i = resource.findIndex(v => v[this.$config.primaryKey] == req.params.id)
  resource[i] = req.body
  res.send(resource[i])
})

// create
router.post('/:resource', (req, res) => {
  const resource = resources[req.params.resource]  
  resource.push(req.body)
  res.send(resource[resource.length - 1])
})

// delete
router.delete('/:resource/:id', (req, res) => {
  const resource = resources[req.params.resource]  
  
  let i = resource.findIndex(v => v[this.$config.primaryKey] == req.params.id)
  resource.splice(i, 1)
  res.send({
    success: true
  })
})
// delete all
router.delete('/:resource', (req, res) => {
  const resource = resources[req.params.resource]  
  
  resource.splice(0)
  res.send({
    success: true
  })
})

app.use('/admin/api', router)

app.listen(8088, () => {
  console.log('Test API is listening at http://localhost:8088')
})