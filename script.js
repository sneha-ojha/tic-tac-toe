// Gameboard Module
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    const makeMove = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const checkWin = () => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let condition of winConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return board.includes("") ? null : "tie";
    };

    return { getBoard, makeMove, checkWin, resetBoard };
})();

// Player Factory
const Player = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;
    return { getName, getMarker };
};

// Game Controller Module
const GameController = (() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayer = player1;
    let gameOver = false;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const playRound = (index) => {
        if (!gameOver && Gameboard.makeMove(index, currentPlayer.getMarker())) {
            const winner = Gameboard.checkWin();
            if (winner) {
                gameOver = true;
                return winner === "tie" ? "It's a tie!" : `${currentPlayer.getName()} wins!`;
            }
            switchPlayer();
            return null;
        }
    };

    const getCurrentPlayer = () => currentPlayer;
    const resetGame = () => {
        Gameboard.resetBoard();
        currentPlayer = player1;
        gameOver = false;
    };

    return { playRound, getCurrentPlayer, resetGame };
})();

// Screen Controller Module
const ScreenController = (() => {
    const boardElement = document.querySelector('.board');
    const turnElement = document.querySelector('.turn');
    const restartButton = document.querySelector('.restart');

    const updateScreen = () => {
        boardElement.textContent = '';
        const board = Gameboard.getBoard();
        board.forEach((cell, index) => {
            const cellElement = document.createElement('button');
            cellElement.classList.add('cell');
            cellElement.textContent = cell;
            cellElement.dataset.index = index;
            boardElement.appendChild(cellElement);
        });
        turnElement.textContent = `${GameController.getCurrentPlayer().getName()}'s turn`;
    };

    const clickHandlerBoard = (e) => {
        if (e.target.classList.contains('cell')) {
            const index = e.target.dataset.index;
            const result = GameController.playRound(index);
            updateScreen();
            if (result) {
                turnElement.textContent = result;
            }
        }
    };

    const clickHandlerRestart = () => {
        GameController.resetGame();
        updateScreen();
    };

    boardElement.addEventListener('click', clickHandlerBoard);
    restartButton.addEventListener('click', clickHandlerRestart);

    updateScreen();
})();
