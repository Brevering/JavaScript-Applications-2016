var express = require('express'),
  bodyParser = require('body-parser'),
  lowdb = require('lowdb');

var db = lowdb('./data/data.json');
db._.mixin(require('underscore-db'));

var app = express();
app.use(bodyParser.json());

app.use(express.static('public'));

require('./utils/authorize-user')(app, db);

//User routes
var usersController = require('./controllers/users-controller')(db);
app.get('/api/users', usersController.get);
app.post('/api/users', usersController.post);
app.put('/api/auth', usersController.put);

// Items
var itemsController = require('./controllers/items-controller')(db);
app.get('/api/items', itemsController.get);
app.post('/api/items', itemsController.post);
app.put('/api/items/:id', itemsController.put);
//
// My Items
var myitemsController = require('./controllers/my-items-controller')(db);
app.get('/api/my-item', myitemsController.get);

// Categories
var categoriesController = require('./controllers/categories-controller')(db);
app.get('/api/categories', categoriesController.get);

var port = process.env.PORT || 1113;
app.listen(port, function() {
  console.log('Server is running at http://localhost:' + port);
});
