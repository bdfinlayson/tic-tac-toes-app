'use strict';

var fb = new Firebase('https://tic-tac-toes-app.firebaseio.com'),
  gameArr = [['','',''],['','',''],['','','']],
  currPlayer = '',
  turnCounter = 0,
  player1 = '', // '/images/tack.jpg',
  player2 = '/images/tick.jpg'; // '/images/tick.jpg';
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
            console.log(authData);
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
      setPlayerImg();
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
  fb.child('players').child(data.uid).set({
    userName: data.uid,
    wins: 0,
    losses: 0,
    gamesPlayed: [''],
    opponentsPlayed: [''],
    isPlayer1: true,
    accountExpiration: data.expires,
    wonCurrGame: false,
    currGame: ''
  });
}


function clearGame () {
  gameArr = [['','',''],['','',''],['','','']];
  turnCounter =  0;
  currPlayer = player1;
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
var row,
    col;
//Click to select move.
$('#boardWrapper').on('click', 'tbody tr td', function(){
  row = this.parentElement.sectionRowIndex;
  col  = this.cellIndex;
  if (gameArr[row][col] === '') {
    gameArr[row][col] = currPlayer;
    checkForWin(gameArr);
    playerTurn();
    renderBoard(gameArr);
    gameOverCheck();
  } else {
    alert('That space is taken please choose another:)');
  }
});


//switch between players and increment turn counter.
function gameOverCheck () {
  if (turnCounter < 9) {
    turnCounter++
  }
  else {
    alert('GAME OVER!');
  }
}


function checkForWin (x) {
  switch(true) {
    //---------------------
    //check winning columns
    //---------------------
    case ((x[0][0] !== '') && (x[0][0] === x[1][0]) && (x[0][0] === x[2][0])):
      alert('Player ' + currPlayer + ' Wins!!!');
      toggleCurrGameWin();
      break;
    case ((x[0][1] !== '') && (x[0][1] === x[1][1]) && (x[0][1] === x[2][1])):
      alert('Player ' + currPlayer + ' Wins!!!');
      break;
    case ((x[0][2] !== '') && (x[0][2] === x[1][2]) && (x[0][2] === x[2][2])):
      alert('Player ' + currPlayer + ' Wins!!!');
      break;
    //---------------------
    //Check winning rows
    //---------------------
    case ((x[0][0] !== '') && (x[0][0] === x[0][1]) && (x[0][0] === x[0][2])):
      alert('Player ' + currPlayer + ' Wins!!!');
      break;
    case ((x[1][0] !== '') && (x[1][0] === x[1][1]) && (x[1][0] === x[1][2])):
      alert('Player ' + currPlayer + ' Wins!!!');
      break;
    case ((x[2][0] !== '') && (x[2][0] === x[2][1]) && (x[2][0] === x[2][2])):
      alert('Player ' + currPlayer + ' Wins!!!');
      break;
    //---------------------
    //Check winning diagonals
    //---------------------
    case ((x[0][0] !== '') && (x[0][0] === x[1][1]) && (x[0][0] === x[2][2])):
      alert('Player ' + currPlayer + ' Wins!!!');
      break;
    case ((x[0][2] !== '') && (x[0][2] === x[1][1]) && (x[0][2] === x[2][0])):
      alert('Player ' + currPlayer + ' Wins!!!');
      break;
    default:
      break;
  }
}


function playerTurn () {
	if (currPlayer === player1) {

    currPlayer = player2;
		return player1;

	} else {

    currPlayer = player1;
    return player2;

	}
}

function setPlayerImg() {
  var playerInfo = fb.getAuth(),
      playerId = playerInfo.uid,
      fbPlayer = $.getJSON('https://tic-tac-toes-app.firebaseio.com/players/' + playerId + '.json', function () {
        console.log(fbPlayer)
        console.log(fbPlayer.responseJSON)

      if (fbPlayer.responseJSON.isPlayer1 === true) {
        currPlayer = '/images/tack.jpg';
        player1 = '/images/tack.jpg';
      } else {
        currPlayer = '/images/tick.jpg';
        player2 = '/images/tick.jpg';
      }
  });
}


function toggleCurrGameWin() {
  var playerInfo = fb.getAuth(),
      playerId = playerInfo.uid,
      fbPlayer = new Firebase('https://tic-tac-toes-app.firebaseio.com/players/' + playerId);
      fbPlayer.child('wonCurrGame').set(true);
}


//function sendPlayerStat () {
//	var playerInfo = fb.getAuth(),
//	  playerId = playerInfo.uid,
//	  playerStat = getCurrentStat(playerId),
//    playerWins = playerStat.wins,
//	  fbPlayers = new Firebase('https://tic-tac-toes-app.firebaseio.com/players/' + playerId)
//  if (playerStat.wonCurrGame === true && playerId === player1.id) {
//  	playerWins++
//	  fbPlayers.child('wins').update(playerWins);
//  } else {
//  	playerWins--
//  	fbPlayers.child('wins').update(playerWins);
//  }
//}

function getCurrentStat (playerData) {

	var data = $.getJSON('https://tic-tac-toes-app.firebaseio.com/players/' + playerData + '.json', function(data){
  console.log(data);
  return data;
  })
}

function getPlayerInfo () {
var playerInfo = fb.getAuth(),
      playerId = playerInfo.uid,
      fbPlayer = $.getJSON('https://tic-tac-toes-app.firebaseio.com/players/' + playerId + '.json', function () {
        console.log(fbPlayer)
        console.log(fbPlayer.responseJSON)
        return fbPlayer;
      });
}
