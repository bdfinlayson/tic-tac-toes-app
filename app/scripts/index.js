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
  alert('Logout successful! Come back soon!')
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

$('table').on('click', 'tbody tr td', function(){
	var index = $('td').index(this);
	switch (index) {
		case 0:
			if (gameArr[0][0] === '') {
				gameArr[0][0] = playerMove();
			} else { alert('Space taken!')}
			break;
		case 1:
		  if (gameArr[0][1] === '') {
			gameArr[0][1] = playerMove();
		}	else { alert('Space taken!')}
			break;
		case 2:
		if (gameArr[0][2] === '') {
		  gameArr[0][2] = playerMove();
		} else { alert('Space taken!')}
		  break;
		case 3:
		  if (gameArr[1][0] === '') {
			gameArr[1][0] = playerMove();
		}	else { alert('Space taken!')}
			break;
		case 4:
		  if (gameArr[1][1] === '') {
		  gameArr[1][1] = playerMove();
		} else { alert('Space taken!')}
		  break;
		case 5:
		  if (gameArr[1][2] === '') {
		  gameArr[1][2] = playerMove();
		} else { alert('Space taken!')}
		  break;
		case 6:
		  if (gameArr[2][0] === '') {
		  gameArr[2][0] = playerMove();
		} else { alert('Space taken!')}
		  break;
		case 7:
		  if (gameArr[2][1] === '') {
		  gameArr[2][1] = playerMove();
		} else { alert('Space taken!')}
		  break;
		case 8:
		  if (gameArr[2][2] === '') {
		  gameArr[2][2] = playerMove();
		} else { alert('Space taken!')}
		  break;
	}
	renderBoard(gameArr);
});

function playerMove(){
	//should switch between players 1 and 2 and increment turnCounter
	//if player 1, switch turnChecker to false and increment turnCounter
	//then return player 1
	//else switch turnChecker to true and increment turnCounter
	//then return player 2
	if (turnChecker === true && turnCounter < 9) {

		turnChecker = false;
		turnCounter++
		return player1;

	} else if (turnChecker === false && turnCounter < 9) { 
      turnChecker = true;
      turnCounter++;
      return player2;
	} else {
		alert('Game over!');
	}
};

