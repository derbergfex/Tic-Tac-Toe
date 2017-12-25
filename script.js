// A variable in which we will assign the id's of the boxes.
var initialBoard;

// Define the global variables of humanPlayer and aiPlayer.
var humanPlayer;
var aiPlayer;

// Assigning values to the global variables above per the user's choice. 
$("#X").on('click', function()
{
    humanPlayer = 'X';
    aiPlayer = 'O';
    document.querySelector(".startWindow").style.display = "none";
    document.querySelector(".game").style.display = "block";
});

$("#O").on('click', function()
{
    humanPlayer = 'O';
    aiPlayer = 'X';
    document.querySelector(".startWindow").style.display = "none";
    document.querySelector(".game").style.display = "block";
});

// An array containing all the possible winning combinations.
const winCombs = 
    [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2],
    ]

// We save all the elements classed "cell" in allBoxes.
const allBoxes = document.querySelectorAll(".cell");

// We launch 'startGame()' once the page is open and once the 'restart' button is clicked.
startGame();
$("#restart").on("click", startGame);

// The function sets up the board; loops through all the boxes, clearing it from any writings/colors.
function startGame()
{
    document.querySelector(".endOfGame").style.display = "none";
    initialBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (var i = 0; i < allBoxes.length; i++)
    {
        allBoxes[i].innerText = '';
        allBoxes[i].style.removeProperty('background-color');
        allBoxes[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(box)
{
    // We check if the spot has not yet been played in.
    if (typeof initialBoard[box.target.id] == 'number') 
    {
        turn(box.target.id, humanPlayer);
        // If the game has not yet been won and there are spots left to play in.
        if (!checkWin(initialBoard, humanPlayer) && !checkTie())
        {
            turn(bestSpot(), aiPlayer);
        }
        
    }
}

function turn(boxId, player)
{
    // Once it's the player's turn, the initialBoard's respective spot is marked as 'X' or 'O'.
    initialBoard[boxId] = player;
    document.getElementById(boxId).innerText = player;
    let gameWon = checkWin(initialBoard, player);
    if (gameWon)
    {
        gameOver(gameWon);
    }
}

function checkWin(board, player)
{
    // plays is an array containing the spots where a certain player had played.
    let plays = board.reduce(function(acc, currElem, currInd)
    {
        if (currElem == player)
        {
            acc.push(currInd);
        }
        return acc;
    },[]);

    let gameWon = null;
  
    for (var i = 0; i < winCombs.length; i++)
        {
        if (winCombs[i].every(x => plays.indexOf(x) > -1))
            {
            gameWon = {index: i, player: player};
            break;
            }
        }
    return gameWon; 
 }

function gameOver(gameWon)
{
    // If humanPlayer had won, color the winning boxes silver; if they had lost, mark them red.
    for (var i = 0; i < 3; i++)
        {
            document.getElementById(winCombs[gameWon.index][i]).style.backgroundColor = gameWon.player == humanPlayer ? "silver": "red";
        }
    // Disable the functionality of all boxes, once the game is won.
    for (var j = 0; j < allBoxes.length; j++)
        {
            allBoxes[j].removeEventListener('click', turnClick, false);
        }
    declareWinner(gameWon.player == humanPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) 
{
	document.querySelector(".endOfGame").style.display = "block";
	document.querySelector(".endOfGame .text").innerText = who;
}

function emptyBoxes() 
{
	return initialBoard.filter(s => typeof s == 'number');
}

function bestSpot() 
{
	return minimax(initialBoard, aiPlayer).index;
}

// If there are no more available spots, it's a tie.
function checkTie() 
{
    // If there are no more available spots, it's a tie.
    if (emptyBoxes().length == 0) 
    {
        // Color all the boxes green and disable the boxes' functionalities. 
        for (var i = 0; i < allBoxes.length; i++) 
        {
			allBoxes[i].style.backgroundColor = "green";
			allBoxes[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie!");
		return true;
	}
	return false;
}


function minimax(newBoard, player)
{
    // The algorithim begins by defining the available spots in an array.
	var availSpots = emptyBoxes(newBoard);

    // The terminal states are then defined.
    if (checkWin(newBoard, humanPlayer)) 
    {
		return {score: -10};
    } 
    else if (checkWin(newBoard, aiPlayer)) 
    {
		return {score: 10};
    } 
    else if (availSpots.length === 0) 
    {
		return {score: 0};
    }
    
    // Here, objects will be stored with each containing their box index and score.
    var moves = [];
    
    // If the minimax function does not find a terminal state, it keeps recursively going level by level deeper into the game.
    // This recursion happens until it reaches a terminal state and returns a score one level up.
    for (var i = 0; i < availSpots.length; i++) 
    {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

        if (player == aiPlayer) 
        {
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
        } 
        else 
        {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

        // The function sets newBoard to what it was before.
		newBoard[availSpots[i]] = move.index;
		moves.push(move);
	}

    // It then picks the move with the highest score when AI is playing and the move with the lowest score when the human is playing.
    var bestMove;
    
    // If the player is aiPlayer, it sets a variable called bestScore to a very low number and loops through the moves array. 
    // If a move has a higher score than bestScore, the algorithm stores that move. 
    // In case there are moves with similar score, only the first one will be stored.
    if (player === aiPlayer) 
    {
		var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) 
        {
            if (moves[i].score > bestScore) 
            {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
    } 
    else 
    {
		var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) 
        {
            if (moves[i].score < bestScore) 
            {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
