var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

// var urlencodedParser = bodyParser.urlencoded( { extended: false } );
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres:localhost:5432/to-do-list';
var port = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static public folder
app.use(express.static('public'));

// spin up server
app.listen(port, function () {
  console.log('spinning on', port);
});

/////////////////////////////// BASE URL //////////////////////////////////
app.get('/', function (req, res) {
  console.log('base URL hit');
  res.sendFile('index.html');
}); // end base url

// list route url
app.route('/list')

/////////////////////////////// GET ///////////////////////////////////////
  .get(function (req, res) {
    console.log('/list get response', req.body);
    pg.connect(connectionString, function (err, client, done) {
        if (err) res.status(500).send('Connection error');

        var resultsArray = [];

        var query = client.query('SELECT * FROM list ORDER BY id ASC');
        query.on('row', function (row) {
          resultsArray.push(row);
        });

        query.on('end', function () {
          done();
          return res.send(resultsArray);
        });
      }); // end pg connect
  }) // end /list get

//////////////////////////////// POST //////////////////////////////////////////////
  .post(function (req, res) {
    console.log('in post', req.body);

    var data = req.body;
    console.log('data:', data);

    pg.connect(connectionString, function (err, client, done) {

      // check for connection error

      if (err) res.status(500).send('Connection error');

      // query database to add/post/insert a tast in the list table
      console.log(data.name);
      var query = client.query('INSERT INTO list (name) VALUES ($1)', [data.name]);

      // push each row of DB TABLE list into resultsArray
      query.on('row', function (row) {
        resultsArray.push(row);
        console.log(resultsArray);
      });

      query.on('end', function () {
        done();
        return res.send('post success!');
      }); // end of on end function
    }); // end pg connect
  }) // end post call

  //////////////////////////////// PUT //////////////////////////////////////////////
  .put(function (req, res) {

    // Body Data
    var data = req.body;

    console.log('Data Recieved:', data);

    pg.connect(connectionString, function (err, client, done) {

      // log/send error if ture
      if (err) res.status(500).send('Connection error');
      var resultsArray = [];
      var query = client.query('DELETE FROM list WHERE name=($1)', [data.name]);

      query.on('row', function (row) {
        resultsArray.push(row);
      }); // end on row

      query.on('end', function () {
        done();
        return res.status(200).send({ status: 'Put success' });
      }); // end on end
    }); // end pg connect
  }); // end put delete task
