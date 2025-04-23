// Connect to WebSocket Server
const ws = new WebSocket("wss://math-nitro-racing.deno.dev/ws");

// Connection Handling
ws.onopen = () => {
    console.log("✅ Connected to server");
    document.getElementById("connection-status").innerText = "Connected!";
};

ws.onmessage = (event) => {
    console.log("📩 Received:", event.data);
    handleServerMessage(JSON.parse(event.data));
};

ws.onerror = (error) => console.error("❌ WebSocket Error:", error);
ws.onclose = () => console.log("🔴 Disconnected");

// Send JSON messages to the server
function sendMessage(message) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.error("WebSocket is not open");
    }
}

// 1️⃣ CREATE GAME
function createGame() {
    const name = prompt("Enter your name:");
    sendMessage({ type: "createGame", difficulty: "easy", name });
}

// 2️⃣ JOIN GAME
function joinGame() {
    const gameID = document.getElementById("gameIDInput").value;
    const name = prompt("Enter your name:");
    sendMessage({ type: "joinGame", gameID, name });
}

// 3️⃣ START GAME (Host Only)
function startGame() {
    sendMessage({ type: "startGame", gameID: currentGameID });
}
function requestNewQuestion(difficulty) {
    // example: difficulty can be "easy", "medium", "hard"
    sendMessage({
        type: "requestNextQuestion",
        difficulty: difficulty
    });
}

// 4️⃣ HANDLE SERVER MESSAGES
let currentGameID = null;
let currentQuestionSet = [];       // Will hold the 20 questions
let currentQuestionIndex = 0;      // Which one we’re on
let currentCorrectAnswer = null;   // Track the correct answer for the displayed question
function handleServerMessage(data) {
    switch (data.type) {
        case "gameCreated":
            currentGameID = data.gameID;
            document.getElementById("game-id-display").innerText = `Game ID: ${currentGameID}`;
            document.getElementById("game-container").style.display = "block";
            break;

        case "joinedGame":
            currentGameID = data.gameID;
            document.getElementById("game-id-display").innerText = `Game ID: ${currentGameID}`;
            document.getElementById("game-container").style.display = "block";
            break;

        case "playerJoined":
            alert(`${data.name} has joined the game!`);
            break;

        case "questions":
            displayQuestion(data.questions);
            break;

        case "gameStarting":
            alert("Game starting in " + data.countdown + " seconds!");
            break;

        case "gameStarted":
            alert("Game Started! Answer the questions!");
            break;

        case "scoreReport":
            document.getElementById("score-display").innerText = `Player ${data.name} - Score: ${data.score}`;
            break;

        case "gameCompleted":
            displayResults(data.players);
            break;

        case "playerRemoved":
            alert(`${data.name} left the game.`);
            break;

        case "ERROR":
            alert(`Error: ${data.message}`);
            break;

        default:
            console.warn("Unhandled message type:", data);
    }
}

// 5️⃣ DISPLAY QUESTION
function displayQuestion(questions) {
    const questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = ""; // Clear previous question

    const questionData = questions[0]; // Get first question

    const questionText = document.createElement("h3");
    questionText.innerText = questionData.question;

    questionContainer.appendChild(questionText);

    // Answer Buttons
    [...questionData.incorrect_answers, questionData.correct_answer]
        .sort(() => Math.random() - 0.5) // Shuffle answers
        .forEach(answer => {
            const button = document.createElement("button");
            button.innerText = answer;
            button.onclick = () => submitAnswer(questionData.id, answer, questionData.correct_answer);
            questionContainer.appendChild(button);
        });
}

// 6️⃣ SUBMIT ANSWER
function submitAnswer(questionID, chosenAnswer, correctAnswer) {
    const isCorrect = chosenAnswer === correctAnswer;
    sendMessage({
        type: "scoreUpdate",
        gameID: currentGameID,
        score: isCorrect ? 10 : 0,
        attempts: 1
    });

    alert(isCorrect ? "✅ Correct!" : "❌ Wrong!");
}

// 7️⃣ DISPLAY GAME RESULTS
function displayResults(players) {
    let resultsText = "Game Over! \n\n";
    players.forEach(player => {
        resultsText += `${player.name} - Time: ${player.time} - Attempts: ${player.attempts}\n`;
    });
    alert(resultsText);
}

// 8️⃣ LEAVE GAME
function leaveGame() {
    sendMessage({ type: "leaveGame", gameID: currentGameID });
}

// 9️⃣ END GAME OR REMATCH
function endGame(status) {
    sendMessage({ type: "endGame", gameID: currentGameID, status });
}