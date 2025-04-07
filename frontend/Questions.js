// Author: Rasheed & Keli'i
//Made: 2/17/2025
//Update:2/25/2025
//Purpose: Question functions for game


let answer = 0;
let questionCount = 0; // Track the number of questions answered

// Library of equations (you can populate this with specific equations)
let equationLibrary = []
function generateEquation() {
    let x, y;
    let wrongAnswer1, wrongAnswer2, wrongAnswer3, wrongAnswer4;

    // Check if there are equations in the library
    if (equationLibrary.length > 0) {
        // Use a random equation from the library
        const randomEquation = equationLibrary[Math.floor(Math.random() * equationLibrary.length)];
        x = randomEquation.x;
        y = randomEquation.y;
    } else {
        // Use a random formula if no library is available
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
    }

    answer = x + y;

    let numbers = []
    numbers.push(answer)

    do {
        wrongAnswer1 = x + (Math.floor(Math.random() * 10));
    } while (numbers.includes(wrongAnswer1));
    numbers.push(wrongAnswer1);
    do {
        wrongAnswer2 = x + (Math.floor(Math.random() * 10));
    } while (numbers.includes(wrongAnswer2));
    numbers.push(wrongAnswer2);
    do {
        wrongAnswer3 = x + (Math.floor(Math.random() * 10));
    } while (numbers.includes(wrongAnswer3));
    numbers.push(wrongAnswer3);
    do {
        wrongAnswer4 = x + (Math.floor(Math.random() * 10));
    } while (numbers.includes(wrongAnswer4));

    document.getElementById("equation").innerHTML = `${x} + ${y} = ?`;

    document.getElementById("bt1").innerText = wrongAnswer1;
    document.getElementById("bt2").innerText = wrongAnswer2;
    document.getElementById("bt3").innerText = wrongAnswer3;
    document.getElementById("bt4").innerText = wrongAnswer4;

    let val = Math.floor(Math.random() * 4);
    switch (val) {
        case 0: {
            document.getElementById("bt1").innerText = answer;
            break;
        } case 1: {
            document.getElementById("bt2").innerText = answer;
            break;
        }
        case 2: {
            document.getElementById("bt3").innerText = answer
            break;
        }
        case 3: {
            document.getElementById("bt4").innerText = answer;
            break;
        }
    }
}

function checkAnswer(button) {
    document.getElementById(button.id).style.animation = "none";
    if (parseInt(button.innerText) === answer) {
        document.getElementById(button.id).classList.add("right-buttons");
        moving = true;
        // Increment the question count and check if 20 questions have been answered
        questionCount++;
        if (questionCount >= 5) {
            window.location.href = "FinishLine.html"; // Redirect to finish page
        }
        moveCar();
        setTimeout(() => {

            const buttonIds = document.querySelectorAll('button')

            buttonIds.forEach(button => {
                document.getElementById(button.id).classList.remove("right-buttons");
                document.getElementById(button.id).classList.remove("wrong-buttons");
            });

            generateEquation();
        }, 800);
    } else {
        document.getElementById(button.id).style.animation = "shake 0.3s ease-in-out 3";
        document.getElementById(button.id).classList.add("wrong-buttons");
        moving = false;
        performFlip();
    }




}
generateEquation();