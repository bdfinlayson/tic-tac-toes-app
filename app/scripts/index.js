'use strict';

var fb = new Firebase('https://tic-tac-toes-app.firebaseio.com'),
  gameArr = [['','/images/tack.jpg',''],['/images/tick.jpg','',''],['','','/images/tack.jpg']];

//login register logout features

$('#registerButton').click(function() {
  var user     = $('#userEmail').val(),
      password = $('#userPassword').val();

  fb.createUser({
    email: user,
    password: password
  }, function(error, userData) {
    if (error) {
    switch (error.code) {
      case "EMAIL_TAKEN":
        alert('This email is already in use.');
        break;
      case "INVALID_EMAIL":
        alert('The specified email is not valid.');
        break;
      default:
        alert('Error creating user:', error);
      }
    } else {
      fb.authWithPassword({
        'email': user,
        'password': password
      }, function(error, authData) {
          if (error) {
            alert("Login Failed!", error);
          } else {
            $('#loginForm').hide("slow");
            sendToFb(authData);
          }
      });
      $('#loginForm').hide("slow");
      //$('#boardWrapper').toggle();
      renderBoard(gameArr);
    }
  });
});


$('#loginButton').click(function() {
  var user     = $('#userEmail').val(),
      password = $('#userPassword').val();
  fb.authWithPassword({
    'email': user,
    'password': password
  }, function(error, authData) {
      if (error) {
        alert("Login Failed!", error);
      } else {
        $('#loginForm').hide("slow");
        //$('#boardWrapper').toggle();
        renderBoard(gameArr);
      }
  });
});


$('#logoutButton').click(function() {
  fb.unauth();
  alert('Logout successful! Come back soon!')
  $('#loginForm').show("slow");
});


function sendToFb(data) {
  fb.child('players').child(data.auth.uid).set({blah: 12345});
}


//Create board

function renderBoard(x) {

	var $tbody = $('<tbody></tbody>');

	x.forEach(function(row) {
		var $tr = $('<tr></tr>');
	 row.forEach(function(cell) {
		$tr.append($('<td><img src="' + cell + '"></img></td>'));
  });
    $tbody.append($tr);
  });
  $('table').append($tbody);
}

