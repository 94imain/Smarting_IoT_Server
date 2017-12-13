var fs = require('fs');
var data = fs.readFileSync('conf.json', 'utf-8');
var conf = JSON.parse(data);
var express = require('express');
var app = express();
var path = require('path');

// Routing
var route = require('./routes/route.js');

// MongoDB
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Connecting to MongoDB server
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
  console.log('Connected to mongod server');
});

var promise = mongoose.connect('mongodb://localhost/mongodb_smarting', {
    useMongoClient: true
});

app.use('/', route);
app.use('/swagger-ui', express.static(path.join(__dirname, './node_modules/swagger-ui/dist')));

app.listen(7579, () => {
  console.log('Start server using the port 7579...');
});
