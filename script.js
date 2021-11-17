// import "./style.css";
var appElement = document.getElementById("app");
var boardElement = document.getElementById("board");
var ROW_COUNT = 3;
var COL_COUNT = 3;
var boardState = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
];
var currentMove = "X";
var winner = "";
var victories = [
    [
        [0, 0],
        [0, 1],
        [0, 2],
    ],
    [
        [1, 0],
        [1, 1],
        [1, 2],
    ],
    [
        [2, 0],
        [2, 1],
        [2, 2],
    ],
    [
        [0, 0],
        [1, 0],
        [2, 0],
    ],
    [
        [0, 1],
        [1, 1],
        [2, 1],
    ],
    [
        [0, 2],
        [1, 2],
        [2, 2],
    ],
    [
        [0, 0],
        [1, 1],
        [2, 2],
    ],
    [
        [0, 2],
        [1, 1],
        [2, 0],
    ],
];
var musicBtn = document.getElementById("music");
function createAudioPlayer(id, src) {
    var audio = document.createElement("audio");
    audio.id = id;
    audio.src = src;
    return audio;
}
var playerMoveAudioPlayer = createAudioPlayer("player-move", "sounds/player-move.wav");
var resetBtnAudioPlayer = createAudioPlayer("reset-board", "sounds/reset.wav");
function checkBoard() {
    var music = musicBtn.dataset.music;
    for (var _i = 0, victories_1 = victories; _i < victories_1.length; _i++) {
        var victory = victories_1[_i];
        var cell1 = boardState[victory[0][0]][victory[0][1]];
        var cell2 = boardState[victory[1][0]][victory[1][1]];
        var cell3 = boardState[victory[2][0]][victory[2][1]];
        if (cell1 !== "" && cell1 === cell2 && cell2 === cell3) {
            if (music !== "mute") {
                var winnerAudioPlayer = createAudioPlayer("audio-winner", "sounds/winner.wav");
                winnerAudioPlayer.play();
            }
            return cell1;
        }
    }
    var isDraw = true;
    rowLoop: for (var i = 0; i < ROW_COUNT; i++) {
        colLoop: for (var j = 0; j < COL_COUNT; j++) {
            if (boardState[i][j] === "") {
                isDraw = false;
                break;
            }
        }
    }
    if (isDraw) {
        if (music !== "mute") {
            var drawAudioPlayer = createAudioPlayer("audio-winner", "sounds/draw.wav");
            drawAudioPlayer.play();
        }
        return "Draw";
    }
    return "";
}
function createCell(row, col, content) {
    if (content === void 0) { content = ""; }
    var cell = document.createElement("button");
    cell.setAttribute("data-row", row.toString());
    cell.setAttribute("data-col", col.toString());
    cell.setAttribute("data-content", content);
    cell.classList.add("cell");
    cell.addEventListener("click", function () {
        if (winner)
            return;
        if (boardState[row][col] === "") {
            boardState[row][col] = currentMove;
            currentMove = currentMove === "X" ? "O" : "X";
            var music = musicBtn.dataset.music;
            if (music !== "mute") {
                playerMoveAudioPlayer.play();
            }
            winner = checkBoard();
            renderBoard();
        }
        // TODO: add funny emoji's if user tried to click non-empty cells
    });
    return cell;
}
function renderBoard() {
    if (!appElement)
        throw new Error("Cannot find app");
    if (!boardElement)
        throw new Error("Cannot find board");
    boardElement.innerHTML = "";
    for (var i = 0; i < ROW_COUNT; i++) {
        for (var j = 0; j < COL_COUNT; j++) {
            boardElement.appendChild(createCell(i, j, boardState[i][j]));
        }
    }
    var oldMoveElement = document.getElementById("move-element");
    if (oldMoveElement) {
        oldMoveElement.remove();
    }
    var moveElement = document.createElement("p");
    moveElement.id = "move-element";
    moveElement.innerText = winner
        ? "Winner " + winner + "!"
        : "Next Move: " + currentMove;
    moveElement.classList.add("current-move");
    appElement.insertBefore(moveElement, document.getElementById("reset"));
}
function init() {
    var resetButton = document.getElementById("reset");
    if (!resetButton)
        throw new Error("No Reset button");
    resetButton.addEventListener("click", function () {
        var music = musicBtn.dataset.music;
        if (music !== "mute") {
            resetBtnAudioPlayer.play();
        }
        boardState = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];
        currentMove = "X";
        winner = "";
        renderBoard();
    });
    renderBoard();
}
// initialize the game
init();
// add event listner on theme toggle button
var toggleThemeBtn = document.getElementById("theme-mode");
toggleThemeBtn.addEventListener("click", function () {
    var theme = document.body.dataset.theme;
    if (theme === "light") {
        document.body.dataset.theme = "dark";
        toggleThemeBtn.innerHTML = "&#127762;";
    }
    else {
        document.body.dataset.theme = "light";
        toggleThemeBtn.innerHTML = "&#127766;";
    }
});
// mute-unmute the sound
musicBtn.addEventListener("click", function () {
    var music = musicBtn.dataset.music;
    if (music === "unmute") {
        musicBtn.innerHTML = "&#128263;";
        musicBtn.dataset.music = "mute";
    }
    else {
        musicBtn.innerHTML = "&#128266;";
        musicBtn.dataset.music = "unmute";
    }
});
