// import "./style.css";

const appElement = document.getElementById("app");
const boardElement = document.getElementById("board");
const ROW_COUNT = 3;
const COL_COUNT = 3;

type Cell = "X" | "O" | "";
type TicTacToeBoard = [
	[Cell, Cell, Cell],
	[Cell, Cell, Cell],
	[Cell, Cell, Cell]
];
let boardState: TicTacToeBoard = [
	["", "", ""],
	["", "", ""],
	["", "", ""],
];
let currentMove: "X" | "O" = "X";
let winner: "X" | "O" | "Draw" | "" = "";
type Coordinate = [number, number];
type Victory = [Coordinate, Coordinate, Coordinate];
const victories: Victory[] = [
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

const musicBtn = document.getElementById("music");

function createAudioPlayer(id: string, src: string) {
	const audio = document.createElement("audio");
	audio.id = id;
	audio.src = src;

	return audio;
}

const playerMoveAudioPlayer = createAudioPlayer(
	"player-move",
	"sounds/player-move.wav"
);
const resetBtnAudioPlayer = createAudioPlayer(
	"reset-board",
	"sounds/reset.wav"
);

function checkBoard(): "X" | "O" | "Draw" | "" {
	const music = musicBtn.dataset.music;
	for (const victory of victories) {
		const cell1 = boardState[victory[0][0]][victory[0][1]];
		const cell2 = boardState[victory[1][0]][victory[1][1]];
		const cell3 = boardState[victory[2][0]][victory[2][1]];

		if (cell1 !== "" && cell1 === cell2 && cell2 === cell3) {
			if (music !== "mute") {
				const winnerAudioPlayer = createAudioPlayer(
					"audio-winner",
					"sounds/winner.wav"
				);
				winnerAudioPlayer.play();
			}
			return cell1;
		}
	}

	let isDraw = true;

	rowLoop: for (let i = 0; i < ROW_COUNT; i++) {
		colLoop: for (let j = 0; j < COL_COUNT; j++) {
			if (boardState[i][j] === "") {
				isDraw = false;
				break;
			}
		}
	}

	if (isDraw) {
		if (music !== "mute") {
			const drawAudioPlayer = createAudioPlayer(
				"audio-winner",
				"sounds/draw.wav"
			);
			drawAudioPlayer.play();
		}
		return "Draw";
	}

	return "";
}

function createCell(row: number, col: number, content: Cell = "") {
	const cell = document.createElement("button");
	cell.setAttribute("data-row", row.toString());
	cell.setAttribute("data-col", col.toString());
	cell.setAttribute("data-content", content);
	cell.classList.add("cell");

	cell.addEventListener("click", () => {
		if (winner) return;

		if (boardState[row][col] === "") {
			boardState[row][col] = currentMove;
			currentMove = currentMove === "X" ? "O" : "X";
			const music = musicBtn.dataset.music;
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
	if (!appElement) throw new Error("Cannot find app");
	if (!boardElement) throw new Error("Cannot find board");
	boardElement.innerHTML = "";
	for (let i = 0; i < ROW_COUNT; i++) {
		for (let j = 0; j < COL_COUNT; j++) {
			boardElement.appendChild(createCell(i, j, boardState[i][j]));
		}
	}
	const oldMoveElement = document.getElementById("move-element");
	if (oldMoveElement) {
		oldMoveElement.remove();
	}
	const moveElement = document.createElement("p");
	moveElement.id = "move-element";
	moveElement.innerText = winner
		? `Winner ${winner}!`
		: `Next Move: ${currentMove}`;
	moveElement.classList.add("current-move");
	appElement.insertBefore(moveElement, document.getElementById("reset"));
}

function init() {
	const resetButton = document.getElementById("reset");
	if (!resetButton) throw new Error("No Reset button");
	resetButton.addEventListener("click", () => {
		const music = musicBtn.dataset.music;
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
const toggleThemeBtn = document.getElementById("theme-mode");
toggleThemeBtn.addEventListener("click", () => {
	const theme = document.body.dataset.theme;
	if (theme === "light") {
		document.body.dataset.theme = "dark";
		toggleThemeBtn.innerHTML = "&#127762;";
	} else {
		document.body.dataset.theme = "light";
		toggleThemeBtn.innerHTML = "&#127766;";
	}
});

// mute-unmute the sound
musicBtn.addEventListener("click", () => {
	const music = musicBtn.dataset.music;
	if (music === "unmute") {
		musicBtn.innerHTML = "&#128263;";
		musicBtn.dataset.music = "mute";
	} else {
		musicBtn.innerHTML = "&#128266;";
		musicBtn.dataset.music = "unmute";
	}
});
