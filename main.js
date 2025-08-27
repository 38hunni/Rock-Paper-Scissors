// DOM references
const playerScoreEl = document.getElementById("player-score");
const computerScoreEl = document.getElementById("computer-score");
const streakEl = document.getElementById("streak");
const resultText = document.getElementById("result-text");
const lastRoundEl = document.getElementById("last-round");
const historyList = document.getElementById("history-list");
const resetBtn = document.getElementById("reset");
const themeToggleBtn = document.getElementById("theme-toggle");
const choiceButtons = document.querySelectorAll(".choices button");

// Game state
let gameState = {
	playerScore: 0,
	computerScore: 0,
	streak: 0,
	history: [],
	theme: "dark",
};

// Load from localStorage
function loadGame() {
	try {
		const saved = JSON.parse(localStorage.getItem("rpsGame"));
		if (saved) {
			gameState = { ...gameState, ...saved };
			document.body.classList.toggle("light", gameState.theme === "light");
		}
	} catch (error) {
		console.error("Error loading game state:", error);
	}
	updateUI();
}

// Save to localStorage
function saveGame() {
	try {
		localStorage.setItem("rpsGame", JSON.stringify(gameState));
	} catch (error) {
		console.error("Error saving game state:", error);
	}
}

// Get computer choice
function getComputerChoice() {
	const choices = ["rock", "paper", "scissors"];
	return choices[Math.floor(Math.random() * 3)];
}

// Play round
function playRound(playerChoice) {
	const computerChoice = getComputerChoice();
	let result = "";

	if (playerChoice === computerChoice) {
		result = "It's a draw!";
		gameState.streak = 0;
	} else if (
		(playerChoice === "rock" && computerChoice === "scissors") ||
		(playerChoice === "paper" && computerChoice === "rock") ||
		(playerChoice === "scissors" && computerChoice === "paper")
	) {
		result = "You win!";
		gameState.playerScore++;
		gameState.streak++;
	} else {
		result = "Computer wins!";
		gameState.computerScore++;
		gameState.streak = 0;
	}

	const timestamp = new Date().toLocaleTimeString();
	gameState.history.unshift(
		`${timestamp}: ${result} (You: ${playerChoice}, CPU: ${computerChoice})`
	);
	if (gameState.history.length > 100) gameState.history.pop();

	lastRoundEl.textContent = `You chose ${playerChoice}, Computer chose ${computerChoice}`;
	resultText.textContent = result;

	updateUI();
	saveGame();
}

// Update UI
function updateUI() {
	playerScoreEl.textContent = gameState.playerScore;
	computerScoreEl.textContent = gameState.computerScore;
	streakEl.textContent = gameState.streak;
	historyList.innerHTML = "";
	gameState.history.forEach((entry) => {
		const li = document.createElement("li");
		li.textContent = entry;
		historyList.appendChild(li);
	});
}

// Event listeners
choiceButtons.forEach((btn) => {
	btn.addEventListener("click", () => playRound(btn.dataset.choice));
});

resetBtn.addEventListener("click", () => {
	if (confirm("Reset game scores and history?")) {
		gameState = {
			playerScore: 0,
			computerScore: 0,
			streak: 0,
			history: [],
			theme: gameState.theme,
		};
		updateUI();
		saveGame();
	}
});

themeToggleBtn.addEventListener("click", () => {
	document.body.classList.toggle("light");
	gameState.theme = document.body.classList.contains("light")
		? "light"
		: "dark";
	saveGame();
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
	if (e.key.toLowerCase() === "r") playRound("rock");
	if (e.key.toLowerCase() === "p") playRound("paper");
	if (e.key.toLowerCase() === "s") playRound("scissors");
});

// Load initial game
loadGame();
