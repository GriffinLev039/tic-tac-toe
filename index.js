const container = document.getElementById("funnylilgrid");
const p1Score = document.getElementById("p1Score");
const p2Score = document.getElementById("p2Score");
const p1Name = document.getElementById("p1Name");
const p2Name = document.getElementById("p2Name");
//To-Do:
//Clean up the below javascript (Basically anything not modular)
//Add win dialogs
const header = document.createElement("h1");
header.textContent = "Change your name:";
const input = document.createElement("input");
input.type="text";
const confirmBtn = document.createElement("button");
confirmBtn.addEventListener('click',()=>{
    p1Name.textContent = input.value;
    dialog.close();
    input.value = "";
});
const dialog = document.createElement("dialog");
dialog.appendChild(header);
dialog.appendChild(input);
dialog.appendChild(confirmBtn);
container.appendChild(dialog);
confirmBtn.textContent = "confirm";
p1Name.addEventListener('click',()=>{
    dialog.showModal();
});

const header2 = document.createElement("h1");
header2.textContent = "Change your name:";
const input2 = document.createElement("input");
input2.type="text";
const confirmBtn2 = document.createElement("button");
confirmBtn2.textContent = "confirm";
confirmBtn2.addEventListener('click',()=>{
    p2Name.textContent = input2.value;
    dialog2.close();
    input2.value = "";
});
const dialog2 = document.createElement("dialog");
dialog2.appendChild(header2);
dialog2.appendChild(input2);
dialog2.appendChild(confirmBtn2);
container.appendChild(dialog2);
p2Name.addEventListener('click',()=>{
    dialog2.showModal();
});

document.getElementById("resetBtn").addEventListener('click',()=>{gameController.resetGame()});


//game object should handle game logic
//should have function to handle display management as well probably? Could be too much for one
//module tho
const game = (function () {
    const gameBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0],];

    function setPos(x, y, value) {
        if (gameBoard[x][y] === 0) {
            gameBoard[x][y] = value;
            return detectWin();
        } else {
            return false;
        }
    }

    function detectWin() {
        //Iterate over array, and see if:
        //  1. Any row are all equal to one another, return that value
        //  2. Any columns are all equal to each other, return that value
        //  3. Check both diagonals, return those
        //in that order.
        let returnVal = 0;
        for (let i = 0; i < 3; i++) {
            if (gameBoard[i][0] === gameBoard[i][1] && gameBoard[i][0] === gameBoard[i][2]) {

                returnVal = gameBoard[i][0];
            }
            if (gameBoard[0][i] === gameBoard[1][i] && gameBoard[0][i] === gameBoard[2][i]) {
                returnVal = gameBoard[0][i];
            }
        }
        if (gameBoard[0][0] === gameBoard[1][1] && gameBoard[0][0] === gameBoard[2][2]) {
            returnVal = gameBoard[0][0];
        }
        if (gameBoard[0][2] === gameBoard[1][1] && gameBoard[0][2] === gameBoard[2][0]) {
            returnVal = gameBoard[0][2];
        }
        if (returnVal !== 0) {
            resetGame();
        }
        if (detectDraw()) {
            return -1;
        }
        return returnVal;
    }

    function detectDraw() {
        for (let i = 0; i < gameBoard.length; i++) {
            for (let j = 0; j < gameBoard[i].length; j++) {
                if (gameBoard[i][j] === 0) {
                    return false;
                }
            }
        }
        resetGame();
        return true;
    }

    function resetGame() {
        for (let i = 0; i < gameBoard.length; i++) {
            for (let j = 0; j < gameBoard[i].length; j++) {
                gameBoard[i][j] = 0;
            }
        }
        gameController.setTurn(2);
        DOMController.resetPointers();
    }

    return {setPos, resetGame};
})();



function newPlayer(playerType) {
    let score = 0;
    let input = playerType;

    function makeMove(x, y) {

        const returnVal = game.setPos(x, y, input);
        if (returnVal === input) {
            addWin();
        }
        return returnVal;
    }

    function addWin() {
        score++;
        if (input === 1) {
            p1Score.textContent=score.toString();
        } else {
            p2Score.textContent=score.toString();

        }
    }
    function resetScore() {
        score = 0;
    }

    return {makeMove, resetScore};
}

const gameController = (function () {
    let currentTurn = 2;
    const player1 = newPlayer(1);
    const player2 = newPlayer(2);

    function mainLogic(sentY, sentX) {
        let player = player2;
        if (currentTurn === 1) {
            player = player1;
        }
        let isValid = player.makeMove(sentY, sentX);
        if (isValid === false) {
            currentTurn = currentTurn === 1 ? 2 : 1;
        }
    }



    function setTurn(aNum) {
        currentTurn = aNum;
    }

    function getTurn() {
        return currentTurn;
    }
    function resetGame() {
        p1Name.textContent = "Player 1";
        p2Name.textContent = "Player 2";
        DOMController.resetPointers();
        game.resetGame();
        player1.resetScore();
        player2.resetScore();
    }

    return {mainLogic, setTurn, getTurn, resetGame};
}());

const DOMController = (function () {
    for (let i = 0; i < 9; i++) {
        const tempPointer = document.getElementById((i + 1).toString());
        let y = Math.floor(i / 3);
        let x = i % 3;
        tempPointer.textContent = "";
        tempPointer.addEventListener('click', () => {
            gameController.setTurn(gameController.getTurn() === 1 ? 2 : 1);
            if (tempPointer.textContent === "") {
                if (gameController.getTurn() ===1) {
                    tempPointer.textContent = "X";
                } else {
                    tempPointer.textContent = "O";
                }
            }
            gameController.mainLogic(y, x);
        });
    }

    function resetPointers(){
        for (const child of container.children) {
            child.textContent = "";
        }
    }
    return {resetPointers};
})();
