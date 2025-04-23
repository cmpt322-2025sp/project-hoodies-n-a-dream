const ws = new WebSocket("wss://math-nitro-racing.deno.dev/ws");
ws.onopen = () => {
    console.log("✅ WebSocket Connected");
};

ws.onmessage = (event) => {
    console.log("📩 Received:", event.data);
};

ws.onerror = (error) => {
    console.error("❌ WebSocket Error:", error);
};

ws.onclose = () => {
    console.log("🔴 WebSocket Disconnected");
};
function Create() {
    // Show the three option buttons instead of navigating immediately
    document.getElementById("buttonContainer").style.display = "block";
    navigateTo("gameAnimation");
}

function addition() {
    let  value = "addition";
    // Holds difficulty for questions
    localStorage.setItem("difficulty",value);
    // When a player clicks one of the three buttons, proceed to game
    window.location.href = "Game_Animation.html";
}
function subtraction() {
    let  value = "subtraction";
    // Holds difficulty
    localStorage.setItem("difficulty",value);
    // holds difficulty
    window.location.href = "Game_Animation.html";
}
function multiplication() {
    let  value = "multiplication";
    // When a player clicks one of the three buttons, proceed to game
    localStorage.setItem("difficulty",value);
    window.location.href = "Game_Animation.html";
}
function Code() {
    let userCode = prompt("Enter your code:");
    if (userCode) {
        alert("You entered: " + userCode); // You can change this to process the code
    } else {
        alert("No code entered.");
    }
}
