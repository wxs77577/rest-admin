const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const router = express.Router()
app.use((req, res, next) => {
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
* CRUD
*/

const users = []
for (let i = 1; i < 46; i++) {
  users.push({_id: '2018AFEDBC0' + String(i), username: `user${i}`, created_at: new Date})
}

// user list data
router.get('/users', (req, res) => {
  const {page = 1, perPage = 10} = JSON.parse(req.query.query)
  res.send({
    total: users.length,
    perPage,
    page,
    data: users.slice((page - 1) * perPage, page * perPage)
  })
})


// data table config for listing users
router.get('/users/grid', (req, res) => {
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
router.get('/users/form', (req, res) => {
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
router.get('/users/:id', (req, res) => {
  const user = users.find(v => v._id == req.params.id)
  res.send(user)
})

// update
router.put('/users/:id', (req, res) => {
  let i = users.findIndex(v => v._id == req.params.id)
  users[i] = req.body
  res.send(users[i])
})

// create
router.post('/users', (req, res) => {
  users.push(req.body)
  res.send(users[users.length - 1])
})

// delete
router.delete('/users/:id', (req, res) => {
  let i = users.findIndex(v => v._id == req.params.id)
  users.splice(i, 1)
  res.send({
    success: true
  })
})
// delete all
router.delete('/users', (req, res) => {
  users.splice(0)
  res.send({
    success: true
  })
})

app.use('/admin/api', router)

app.listen(8088, () => {
  console.log('Test API is listening at http://localhost:8088')
})