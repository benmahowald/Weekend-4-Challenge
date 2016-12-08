console.log('js is sourced');

// globals

$(document).ready(function () {
    // console.log( 'JQ');
    //////////////////////// AJAX GET LIST ON READY /////////////////////////////

    $.ajax({
      type: 'GET',
      url: '/list',
      success: function (data) {
        var list = data;
        console.log('got this back from server:', list);
        displayTasks(list);

        // displayTasks(task);
      }, // end success
    }); // end ajax

    ///////////////////////// ON CLICK     CREATE     /////////////////////////
    $('#create').on('click', function () {
      console.log('in create on click');

      // assemble object to send
      var sendTask = {
        name: $('#taskName').val(),
      };

      // ajax call to post route
      $.ajax({
        type: 'POST',
        url: '/list',
        data: sendTask,
        success: function (data) {
          var task = data;

          // nested get call that retrieves the most current version of the list table
          ajaxGet();
        }, // end POST success
      }); // end ajax POST route
    }); // end create on click

    ///////////////////////// ON CLICK CONFIRM /////////////////////////

  //   $('body').on('change', '#checkerson', function () {
  //     console.log('in #checkerson click');
  //     $(this).parent().css({ 'text-decoration': 'line-through' });
  //
  //     // assemble object to send
  //     var sendTask = {
  //       name: $(this).data('name'),
  //       status: 'true',
  //     };
  //
  //     // ajax call to post route
  //     $.ajax({
  //       type: 'PUT',
  //       url: '/list',
  //       data: sendTask,
  //       success: function (data) {
  //         var task = data;
  //         console.log('confirm status success');
  //
  //         // nested get call that retrieves the most current version of the list table
  //         ajaxGet();
  //       }, // end POST success
  //     }); // end ajax POST route
  //   }); // end create on click
  // });

$('body').on('click', '.completeButton', function () {
    console.log('in confirm on click');

      $(this).parent().css({ 'text-decoration': 'line-through' });

      // assemble object to send
      var sendTask = {
        name: $(this).data('name'),
        status: 'true',
      };

      // ajax call to post route
      $.ajax({
        type: 'PUT',
        url: '/list',
        data: sendTask,
        success: function (data) {
          var task = data;
          console.log('confirm status success');

          // nested get call that retrieves the most current version of the list table
          ajaxGet();
        }, // end POST success
      }); // end ajax POST route
    }); // end create on click

    ///////////////////////// ON CLICK DELETE /////////////////////////

    $('body').on('click', '.deleteButton', function () {
      console.log('in delete on click');

      // assemble object to send
      var sendTask = {
        name: $(this).data('name'),
      };

      // ajax call to post route
      $.ajax({
        type: 'DELETE',
        url: '/list',
        data: sendTask,
        success: function (data) {
          var task = data;
          console.log('delete success');

          // nested get call that retrieves the most current version of the list table
          ajaxGet();
        }, // end POST success
      }); // end ajax POST route
    }); // end create on click

  }); // end doc ready

//////////////////////////////// OUTSIDE ON READY /////////////////////////////

// function for displaying all tasks
var displayTasks = function (list) {
  console.log('in displayTasks');

  // empty the user submited input field
  $('#taskName').val('');

  //empty the output div
  $('#outputDiv').empty();

  //create a container for the entire task list
  var container = $('<div />', { class: 'list' });

  // loop through all of the tasks
  for (var i = 0; i < list.length; i++) {

    // div for individual tasks
    var div = $('<div />', { class: 'tasks' });

    if (list[i].status) {
      var checkBox = '<input id="checkerson" type="checkbox" checked>';
    } // end if statement
    // add checkbox
    var checkBox = '<input id="checkerson" type="checkbox">';

    // add the task name
    var taskNameDOM = '<p>' + list[i].name + '</p>';

    // add a complete button with data linked to task name
    // var completeMe = '<button class="completeButton" data-name="' + list[i].name + '">DONE</button>';

    // add a delete button with data linked to task name
    var deleteMe = '<button class="deleteButton" data-name="' + list[i].name + '">CLEAR</button>';

    // append html elements in individual divs
    div.append(checkBox).append(taskNameDOM).append(deleteMe);

    // nest individual divs inside the larger container
    container.append(div);
  } // end for loop

  $('#outputDiv').append(container);
}; // end displayTasks

// ajax call in a function to make above code easier to read
var ajaxGet = function () {
  $.ajax({
    type: 'GET',
    url: '/list',
    success: function (data) {
      var list = data;
      console.log('get route hit');
      displayTasks(list);

      // displayTasks(task);
    }, // end GET success
  }); // end ajax GET route
};
