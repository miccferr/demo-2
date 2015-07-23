var pg = require('pg');
var path = require('path');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));

var client = new pg.Client(connectionString);
client.connect();
// var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, doc JSON not null');
CREATE TABLE justjson ( id INTEGER, doc JSON)
query.on('end', function() { client.end(); });

