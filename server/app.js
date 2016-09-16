var express = require( 'express' );
var app = express();
var path = require( 'path' );
var bodyParser = require( 'body-parser' );
var urlencodedParser = bodyParser.urlencoded( { extended: false } );
var port = process.env.PORT || 8080;

// static public folder
app.use( express.static( 'public' ) );

// spin up server
app.listen( port, function(){
  console.log( 'server up on', port );
});

// base
app.get( '/', function( req, res ){
  console.log( 'base URL hit' );
  res.sendFile( 'index.html' );
}); // end base url

// post template
app.post( '/poster', urlencodedParser, function( req, res ){
  console.log( 'in post template', req.body );
  // assemble objectToSend
  var objectToSend={
    response: 'from server'
  };
  // send object back to client
  res.send( objectToSend );
}); // end post template
