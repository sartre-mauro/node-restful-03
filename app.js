var express = require('express')
  , http = require('http')
  , path = require('path')
  , contacts = require('./modules/contacts');

var errorhandler = require('errorhandler')
var methodOverride = require('method-override');
var bodyParser = require('body-parser');

var url = require('url');
var app = express();

// all ENVs
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

app.get('/contacts', function (request, response) {
  var get_params = url.parse(request.url, true).query;

  if (Object.keys(get_params).length == 0) {
    response.setHeader('content-type', 'application/json');
    response.end(JSON.stringify(contacts.list()));
  } else {
    response.setHeader('content-type', 'application/json');
    response.end(JSON.stringify(contacts.query_by_arg(
      get_params.arg,
      get_params.value)
    ));
  }
});

app.get('/contacts/:number', function(req, res) {
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(contacts.query(req.params.number)));
});

app.get('/groups', function(req, res) {
  console.log('groups');
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(contacts.list_groups()));
});

app.get('/groups/:name', function(req, res) {
  console.log('groups');
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(contacts.get_members(req.params.name)));
});

// DEV Only
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorhandler())
}

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
