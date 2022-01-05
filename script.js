//player factory
const Player = (name, mark) => {

    const getName = () => name;
    const getMark = () => mark;

    return { getName, getMark };
};

//game object (to control flow of game)
const game = (function() {
    const gameBoard = (function() { 
        const score = (function initializeScoreBoard() {
            const scoreArray = [];
            for (let r = 0; r < 3; r++) {
                scoreArray[r] = []; 
                for (let c = 0; c < 3; c++) {
                    scoreArray[r][c] = null;
                }
            }
            return scoreArray;
        })();

        const setUpGameBoard = () => { 
            const gridBoard = document.querySelector('.grid-board');
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    const grid = document.createElement('div');

                    grid.setAttribute('data-row', r);
                    grid.setAttribute('data-col', c);
                    grid.classList.toggle('grid-cell');

                    gridBoard.appendChild(grid);                
                }
            }
        };

        const updateScore = (mark, row, col) => {
            score[row][col] = mark;
        }
        
        return { score, setUpGameBoard, updateScore };    
    })();

    let player1;
    let player2;
    let currentPlayer;
    let turnsPlayed = 0;
    const gridBoard = document.querySelector('.grid-board');
    const gameStatusDisplay = gridBoard.nextElementSibling;

    const playGame = () => {
        gameBoard.setUpGameBoard();
        getPlayerData();
        currentPlayer = player1;
        startGame();
    };

    const getPlayerData = () => {
        player1 = Player(/* prompt(`What is Player One's name?`) || */ 'Player One', 'x');
        player2 = Player(/* prompt(`What is Player Two's name?`) ||  */ 'Player Two', 'o'); 
    }

    const startGame = () => {
        Array.from(gridBoard.children).forEach(grid => {
            grid.addEventListener('click', getGridLocation);
        });
    };

    //handle click event & get info about the marked grid cell
    const getGridLocation = (event) => {
        const mark = currentPlayer.getMark();
        const row = event.target.getAttribute('data-row');
        const col = event.target.getAttribute('data-col');

        placeMark(mark, row, col, event);
    };

    //update score and display
    const placeMark = (mark, row, col, event) => {
        console.log(turnsPlayed);
        if (gameBoard.score[row][col] === null) {
            turnsPlayed++;
            gameBoard.updateScore(mark, row, col);
            console.log(gameBoard.score);

            (function updateBoardDisplay() {
                if (mark === 'x') {
                    event.target.style.color = 'rgb(247, 116, 49)';
                    event.target.innerText = mark;
                } else if (mark === 'o') {
                    event.target.style.color = 'rgb(190, 215, 83)';
                    event.target.innerText = mark;
                } 
                const nextPlayer = currentPlayer === player1 ? player2 : player1;
                gameStatusDisplay.innerText = `${nextPlayer.getName()}'s turn!`
            })();

            if (!checkWinnerFound()) {
                currentPlayer = currentPlayer === player1 ? player2 : player1;
            } else {
                (function declareWinner() {
                    Array.from(gridBoard.children).forEach(grid => {
                        grid.removeEventListener('click', getGridLocation);
                    });
                    if (turnsPlayed === 9) {
                        gameStatusDisplay.style.color = 'lightsalmon';
                        gameStatusDisplay.innerText = `It's a draw!`;
                    } else {
                        gameStatusDisplay.style.color = 'limegreen';
                        gameStatusDisplay.innerText = `${currentPlayer.getName()} is the winner!`;
                    }
                })();
            }
        }
    };

    const checkWinnerFound = () => {
        if (turnsPlayed === 9) {
            return true;
        }
        const score = gameBoard.score;
        //hardcoded
        switch (true) {
            case score[0][0] !== null && score[0][0] === score[0][1] && score[0][1] === score[0][2]:
                return true;
            case score[1][0] !== null && score[1][0] === score[1][1] && score[1][1] === score[1][2]:
                return true;
            case score[2][0] !== null && score[2][0] === score[2][1] && score[2][1] === score[2][2]:  
                return true;  
            case score[0][0] !== null && score[0][0] === score[1][0] && score[1][0] === score[2][0]:
                return true; 
            case score[0][1] !== null && score[0][1] === score[1][1] && score[1][1] === score[2][1]:
                return true; 
            case score[0][2] !== null && score[0][2] === score[1][2] && score[1][2] === score[2][2]:
                return true; 
            case score[0][0] !== null && score[0][0] === score[1][1] && score[1][1] === score[2][2]:
                return true; 
            case score[0][2] !== null && score[0][2] === score[1][1] && score[1][1] === score[2][0]:
                return true; 
            default: 
                return false;
        }
    };

    return { playGame };
})();

game.playGame();

//Add logic for tie
//Add reset button