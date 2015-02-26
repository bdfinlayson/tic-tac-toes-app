'use strict';

var fb = new Firebase('https://tic-tac-toes-app.firebaseio.com'),
  gameArr = [['','',''],['','',''],['','','']],
  turnChecker = true,
  turnCounter = 0,
  player1 = '/images/tack.jpg',
  player2 = '/images/tick.jpg';

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
      clearGame();
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
      clearGame();
      renderBoard(gameArr);
    }
  });
});


$('#logoutButton').click(function() {
  fb.unauth();
  $('#boardWrapper').empty();
  alert('Logout successful! Come back soon!');
  $('#loginForm').show("slow");
});


function sendToFb(data) {
  fb.child('players').child(data.auth.uid).set({blah: 12345});
}


function clearGame () {
  gameArr = [['','',''],['','',''],['','','']];
  turnCounter =  0;
  turnChecker = true;
}

//Create board

function renderBoard(x) {
  $('table').empty();
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

//Click to select move.
$('#boardWrapper').on('click', 'tbody tr td', function(){
  var row,
      col;
  row = this.parentElement.sectionRowIndex;
  col  = this.cellIndex;
  if (gameArr[row][col] === '') {
    gameArr[row][col] = playerMove();
    renderBoard(gameArr);
    gameOverCheck();
  } else {
    alert('That space is taken please choose another:)');
  }
});


//switch between players and increment turn counter.
function gameOverCheck () {
  if (!(turnCounter < 9)) {
    alert('GAME OVER!');
  }
}


function playerMove(){
	if (turnChecker === true) {

		turnChecker = false;
		turnCounter++;
		return player1;

	} else {

    turnChecker = true;
    turnCounter++;
    return player2;

	}
}

