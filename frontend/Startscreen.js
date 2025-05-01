let value = "";
function createGame() {

    ws.send(JSON.stringify({ type: "createGame", difficulty: value, name: "***" }));
}

function Create() {
    //createGame();
    // Show the three option buttons after creating the game
    document.getElementById("buttonContainer").style.display = "block";
}

function addition() {
    value = "easy";
    // Holds difficulty for questions
    localStorage.setItem("difficulty",value);
    // When a player clicks one of the three buttons, proceed to game
    createGame();
    navigateTo("gameAnimation");

}
function subtraction() {
    value = "medium";
    // Holds difficulty
    localStorage.setItem("difficulty",value);
    // holds difficulty
    createGame();
    navigateTo("gameAnimation");
}
function multiplication() {
    value = "hard";
    // When a player clicks one of the three buttons, proceed to game
    localStorage.setItem("difficulty",value);
    createGame();
    navigateTo("gameAnimation");
}
function Code() {
    let userCode = prompt("Enter your code:");
    if (userCode) {
        alert("You entered: " + userCode); // You can change this to process the code
    } else {
        alert("No code entered.");
    }
}
