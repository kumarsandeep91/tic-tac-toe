// import "./style.css";
var appElement = document.getElementById("app");
var boardElement = document.getElementById("board");
var ROW_COUNT = 3;
var COL_COUNT = 3;
var boardState = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];
var currentMove = "X";
function createCell(row, col, content) {
    if (content === void 0) { content = ""; }
    var cell = document.createElement("button");
    cell.setAttribute("data-row", row.toString());
    cell.setAttribute("data-col", col.toString());
    cell.setAttribute("data-content", content);
    cell.classList.add("cell");
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
    moveElement.innerText = "Next Move: " + currentMove;
    moveElement.classList.add("current-move");
    appElement.insertBefore(moveElement, document.getElementById("reset"));
}
function init() {
    var resetButton = document.getElementById("reset");
    if (!resetButton)
        throw new Error("No Reset button");
    resetButton.addEventListener("click", function () {
        boardState = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
        currentMove = "X";
        renderBoard();
    });
    renderBoard();
}
init();
