function createGame() {
    ws.send(JSON.stringify({ type: "createGame" }));
}

function Create() {
    createGame();
    // Show the three option buttons after creating the game
    document.getElementById("buttonContainer").style.display = "block";
}

function addition() {
    let  value = "addition";
    // Holds difficulty for questions
    localStorage.setItem("difficulty",value);
    // When a player clicks one of the three buttons, proceed to game
    navigateTo("gameAnimation");

}
function subtraction() {
    let  value = "subtraction";
    // Holds difficulty
    localStorage.setItem("difficulty",value);
    // holds difficulty
    navigateTo("gameAnimation");
}
function multiplication() {
    let  value = "multiplication";
    // When a player clicks one of the three buttons, proceed to game
    localStorage.setItem("difficulty",value);
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
