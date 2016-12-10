var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var photo = require("nat-geo-api");

// var urlencodedParser = bodyParser.urlencoded( { extended: false } );
var pg = require('pg');
if(process.env.DATABASE_URL != undefined) {
    var connectionString = process.env.DATABASE_URL + "?ssl=true";
} else {
    // running locally, use our local database instead
    var connectionString = 'postgres://localhost:5432/to-do-list';
}
// var connectionString = process.env.DATABASE_URL + "?ssl=true"|| 'postgres:localhost:5432/to-do-list';
var porto = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static public folder
app.use(express.static('public'));

// spin up server
app.listen(porto, function () {
  console.log('spinning on', porto);
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
    console.log('/list get response');
    pg.connect(connectionString, function (err, client, done) {
        if (err) res.status(500).send('Connection error');

        var resultsArray = [];

        var query = client.query('SELECT * FROM list ORDER BY status ASC');
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
    console.log('in put route');
    // Body Data
    var data = req.body;

    console.log('Data Recieved:', data);

    pg.connect(connectionString, function (err, client, done) {

      // log/send error if ture
      if (err) res.status(500).send('Connection error');
      // query database to update status
      var query = client.query('UPDATE list set status=($1) WHERE name=($2)', [data.status, data.name]);

      query.on('row', function (row) {
      }); // end on row

      query.on('end', function () {
        done();
        return res.status(200).send({ status: 'Put success' });
      }); // end on end
    }); // end pg connect
  }) // end put update task

//////////////////////////////// DELETE //////////////////////////////////////////////
  .delete(function (req, res) {
    console.log('in delete');
    // Body Data
    var data = req.body;

    console.log('Data Recieved:', data);

    pg.connect(connectionString, function (err, client, done) {

      // log/send error
      if (err) res.status(500).send('Connection error');

      // query DB with delete statement
      var query = client.query('DELETE FROM list WHERE name=($1)', [data.name]);

      query.on('end', function () {
        done();
        return res.status(200).send({ status: 'Delete success' });
      }); // end on end
    }); // end pg connect
  }); // end put delete task
