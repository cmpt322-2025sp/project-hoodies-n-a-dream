// Author: Rasheed & Keli'i
//Made: 2/17/2025
//Update:2/25/2025
//Purpose: Question functions for game

let answer = 0;
let questionCount = 0; // Track the number of questions answered
let streak = 0;
const carStreak = document.getElementById('carStreak');
let sparkInterval;
const clock = document.getElementById('clock');
const equation = document.getElementById('equation');
const player_border = document.getElementById('player-border');
const game_border = document.getElementById('game-border');
let sparkIntervals = [];
let flag2 = true;
const fireStreaks = document.getElementsByClassName("fireStreak");

const answerStreak = document.getElementById('answerStreak');

const rightSound = document.getElementById('rightSound');
const wrongSound = document.getElementById('wrongSound');
const streakSound = document.getElementById('streakSound');

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

    equation.innerHTML = `${x} + ${y} = ?`;

    document.getElementById("bt1span").innerText = wrongAnswer1;
    document.getElementById("bt2span").innerText = wrongAnswer2;
    document.getElementById("bt3span").innerText = wrongAnswer3;
    document.getElementById("bt4span").innerText = wrongAnswer4;

    let val = Math.floor(Math.random() * 4);
    switch (val) {
        case 0: {
            document.getElementById("bt1span").innerText = answer;
            break;
        } case 1: {
            document.getElementById("bt2span").innerText = answer;
            break;
        }
        case 2: {
            document.getElementById("bt3span").innerText = answer
            break;
        }
        case 3: {
            document.getElementById("bt4span").innerText = answer;
            break;
        }
    }
}

function checkAnswer(button) {
    maxMapSpeed += .05;
    maxTrackSpeed += 0.5;
    button.style.animation = "none";
    let Span = button.querySelector('span');
    let buttonSpanIds = document.querySelectorAll('span');
    const buttonIds = document.querySelectorAll('button')
    if (parseInt(button.querySelector('span').innerText) === answer) {

        questionCount++;
        streak++;
        maxMapSpeed += .1;
        maxTrackSpeed += 1;
        if (questionCount%2 === 0) {
            positionalIndex += 0.05;
        }

        button.classList.add("right-buttons");
        if (streak >= 8) {
            button.classList.add('right-buttons');
            Span.style.color = "white";
        }

        rightSound.play();

        moving = true;
        //moveCar();


        setTimeout(() => {
            buttonIds.forEach(button => {
                button.classList.remove("right-buttons");
                button.classList.remove("wrong-buttons");
                button.style.opacity = "1";
                button.style.animation = "none";
            });

            switch(streak) {
                case 1:
                    break;

                case 2:
                    carStreak.style.animation = "op 0.01s linear infinite";
                    carStreak.style.visibility = "visible";
                    break;
                case 4:
                    answerStreak.innerHTML = "Streak 4!";
                    answerStreak.style.visibility = "visible";
                    answerStreak.style.animation = "fadeOut2 1.5s ease forwards";
                    fireStreaks[0].style.visibility = "visible";
                    break;
                case 6:
                    game_border.style.animation = "flashingBorder 2s linear infinite";
                    fireStreaks[1].style.visibility = "visible";
                    break;


                case 8:
                    buttonSpanIds.forEach(Span => {
                        Span.style.color = "transparent";
                        Span.style.textShadow = "0 0 10px mediumspringgreen";
                    });
                    carStreak.style.backgroundImage = "linear-gradient(to right, transparent 50%, mediumSpringgreen 100%)";
                    player_border.style.color = "transparent";
                    clock.style.color = "transparent";
                    equation.style.color = "transparent";
                    equation.style.textShadow = "0 0 10px mediumspringgreen";
                    answerStreak.innerHTML = "Streak 8!";
                    answerStreak.style.animation = "none";
                    answerStreak.offsetWidth;
                    answerStreak.style.animation = "fadeOut2 1.5s ease forwards ";
                    fireStreaks[0].src = "../Assets/fireStreak6.png";
                    fireStreaks[1].src = "../Assets/fireStreak6.png";
                    fireStreaks[2].style.visibility = "visible";
                    break;

                case 12:
                    game_border.style.animation = "flashingBorder2 2s linear infinite";
                    carShield.style.animation = "fadeOut 0.001s linear infinite";
                    carShield.style.visibility = "visible";
                    answerStreak.innerHTML = "Streak 12!";
                    answerStreak.style.background = "linear-gradient(to right, mediumseagreen, mediumspringgreen, springgreen)";
                    answerStreak.style.textShadow = "0 0 10px mediumspringgreen";
                    answerStreak.style.webkitBackgroundClip = "text";
                    answerStreak.style.color = "transparent";
                    answerStreak.style.animation = "none";
                    answerStreak.offsetWidth;
                    answerStreak.style.animation = "fadeOut2 1.5s ease forwards ";
                    fireStreaks[3].style.visibility = "visible";
                    break;

                case 15:
                    game_border.style.animation = "flashingBorder3 2s linear infinite";
                    clock.style.color = "aqua";
                    player_border.style.color = "aqua";
                    equation.style.background = "linear-gradient(to right, deepskyblue, aqua), -webkit-background-clip: text";
                    equation.style.textShadow = "0 0 10px aqua";
                    carStreak.style.backgroundImage = "linear-gradient(to right, transparent 50%, aqua 100%)";
                    carShield.style.borderRight = "5px solid aqua";
                    carShield.style.background = "linear-gradient(to right, transparent 0%, transparent 80%, aqua 100%)";
                    buttonSpanIds.forEach(Span => {
                        Span.style.textShadow = "0 0 10px aqua";
                        Span.style.background = "linear-gradient(to right, deepskyblue, aqua), -webkit-background-clip: text";
                    });
                    document.querySelector(".spark").style.backgroundColor = "aqua";
                    answerStreak.innerHTML = "Streak 15!";
                    answerStreak.style.background = "linear-gradient(to right, darkturquoise, cyan, aqua)";
                    answerStreak.style.webkitBackgroundClip = "text";
                    answerStreak.style.color = "transparent";
                    answerStreak.style.textShadow = "0 0 10px aqua";
                    answerStreak.style.animation = "none";
                    answerStreak.offsetWidth;
                    answerStreak.style.animation = "fadeOut2 1.5s ease forwards ";
                    fireStreaks[0].src = "../Assets/fireStreak3.png";
                    fireStreaks[1].src = "../Assets/fireStreak3.png";
                    fireStreaks[2].src = "../Assets/fireStreak3.png";
                    fireStreaks[3].src = "../Assets/fireStreak3.png";
                    fireStreaks[4].style.visibility = "visible";
                    break;
                case 18:
                    answerStreak.innerHTML = "Streak 18!";
                    answerStreak.style.animation = "none";
                    answerStreak.offsetWidth;
                    answerStreak.style.animation = "fadeOut2 1.5s ease forwards ";
                    fireStreaks[5].style.visibility = "visible";
            }

            if (streak >= 4) {
                buttonIds.forEach(button => {
                    button.style.animation = "rotateBorders 1s linear infinite";

                });
            }

            if (streak >= 8) {
                Span.style.color = "transparent";
            }

            if (streak >= 12) {
                sparkInterval = setInterval(() => {
                    const x = Math.random() * window.innerWidth;  // Random X position on the screen
                    const y = Math.random() * window.innerHeight; // Random Y position on the screen
                    createSpark(x, y);
                }, 50); // Creates a spark every 50ms
                sparkIntervals.push(sparkInterval);
            }

            flag2 = true;

            if (questionCount >= 1) {
                ending = true
                stopStreakAnimation(button, buttonIds, buttonSpanIds);
                //window.location.href = "FinishLine.html";
                stopGame();
                SetTimeout(() => navigateTo('finishLine'), 2000);
                //window.location.href = "Startsection.html"; // Redirect to finish page
            }
            generateEquation();
        }, 800);

    }
    else {
        stopStreakAnimation(button, buttonIds, buttonSpanIds);
        maxMapSpeed = 1;
        speedB = 1;
        maxTrackSpeed = 35;
        speedTrack = 35;
        carSpeed = -0.5;
        for (let i = 0; i < fireStreaks.length; i++) {
            fireStreaks[i].style.visibility = "hidden";
        }
        fireStreaks[0].src = "../Assets/fireStreak5.png";
        fireStreaks[1].src = "../Assets/fireStreak5.png";
        button.style.animation = "shake 0.3s ease-in-out 3, fadeOut 4s forwards";
        wrongSound.play(8.4);
        setTimeout(() => {
            wrongSound.pause();
        }, 1400);
        button.classList.add("wrong-buttons");
        moving = false;
        performFlip();
        streak = 0;
    }

}

function stopStreakAnimation(button, buttonIds, buttonSpanIds) {
    if (flag2) {
        buttonIds.forEach(button => {
            button.style.animation = "none";
            flag2 = false;
        });
    }
    carStreak.style.animation = "none";
    carStreak.style.visibility = "hidden";
    game_border.style.animation = "none";
    buttonSpanIds.forEach(Span => {
        Span.style.color = "white";
        Span.style.textShadow = "none";
    });
    carStreak.style.backgroundImage = "linear-gradient(to right, transparent 50%, lightpink 60%, lightsalmon 70%, lightcoral 80%, orange 90%, orangered 100%, transparent 100%)";
    player_border.style.color = "white";
    player_border.style.textShadow = "none";
    clock.style.color = "white";
    equation.style.color = "white";
    equation.style.textShadow = "none";
    for (let i = 0; i < sparkIntervals.length; i++) {
        clearInterval(sparkIntervals[i]);
    }
    sparkIntervals = [];
    carShield.style.animation = "none";
    carShield.style.visibility = "hidden";
    maxMapSpeed = 1;
    maxTrackSpeed = 35;
}
generateEquation();