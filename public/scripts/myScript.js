console.log( 'js' );
$( document ).ready( function(){
  console.log( 'JQ');
  $( '#sender' ).on( 'click', function(){
    console.log( 'in sender on click' );
    // assemble object to send
    var objectToSend={
      request: 'from client'
    };
    // ajax call to post route
    $.ajax({
      type: 'POST',
      url: '/poster',
      data: objectToSend,
      success: function( data ){
        console.log( 'get this back from server:', data );
      } // end success
    }); // end ajax
  }); // end sender on click
}); // end doc ready
