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
                    grid.classList.toggle('grid-spot');

                    gridBoard.appendChild(grid);                
                }
            }
        };
        const updateBoard = (mark, row, col) => {
            score[row][col] = mark;
        }
        return { score, setUpGameBoard, updateBoard };    
    })();

    let player1;
    let player2;
    let currentPlayer;
    const gridBoard = document.querySelector('.grid-board');

    const startGame = () => {
        gameBoard.setUpGameBoard();
        getPlayerData();
        currentPlayer = player1;
        playRound();
    };

    const getPlayerData = () => {
        player1 = Player(/* prompt(`What is Player One's name?`) || */ 'Player One', 'x');
        player2 = Player(/* prompt(`What is Player Two's name?`) ||  */ 'Player Two', 'o'); 
    }

    const playRound = () => {
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
        if (gameBoard.score[row][col] === null) {

            gameBoard.updateBoard(mark, row, col);
            console.log(gameBoard.score);

            (function updateDisplay() {
                if (mark === 'x') {
                    event.target.style.backgroundColor = 'blue';
                } else if (mark === 'o') {
                    event.target.style.backgroundColor = 'yellow';
                } 
            })();

            if (!checkWinnerFound()) {
                currentPlayer = currentPlayer === player1 ? player2 : player1;
            } else {
                (function declareWinner() {
                    Array.from(gridBoard.children).forEach(grid => {
                        grid.removeEventListener('click', getGridLocation);
                    });
                    alert(`The winner is ${currentPlayer.getName()}`);
                })();
            }
        }
    };

    const checkWinnerFound = () => {
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

    return { startGame };
})();

game.startGame();

