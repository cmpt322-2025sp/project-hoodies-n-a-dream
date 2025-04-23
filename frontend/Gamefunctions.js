// Author: Rasheed & Keli'i
//Made: 2/17/2025
//Update:2/25/2025
//Purpose: Car movement and game functions

const car = document.getElementById('car');
const flipFrames = ['../assets/Car6.png', '../assets/Car7.png', '../assets/Car8.png', '../assets/Car1.png'];
let moveSpeed = 5;
let isFlipping = false;
let moving = false;
let introPlaying = true;

const targetPosition = window.innerWidth * 0.10;
let carPosition = 20;

const map1 = document.getElementById("map1");
const map2 = document.getElementById("map2");
const map3 = document.getElementById("map3");
const track = document.getElementById("track");
const transition = document.getElementById("transition");

let positionT = 0; // Transition - right viewport
let positionB = 0; // Map1 - left viewport
let positionTrack = 0;
let speedTrack = 0;
let speedB = 0; // speed of Map background
let speedT = 45; // speed of Transition background
let carSpeed = 0 //speed of Car
let maxMapSpeed = 1;
let maxTrackSpeed = 35;
let positionalIndex = 0.15;

let maps = [map1, map2, map3];
let index = 0;

let flag = true; //To make sure index is changed once when needed
let start = false;
let ending = false;

const red = document.getElementById('red');
const yellow = document.getElementById('yellow');
const green = document.getElementById('green');

let light = document.querySelector(".traffic-light-box");

const countSound = document.getElementById("countSound");
const soundTrack = document.getElementById("soundTrack");

const countDown1 = document.getElementById('countDown');


const carShield = document.getElementById("carShield");


function animateGame() {
    maps[index].style.backgroundPosition = `${positionB}px`;
    if (speedB < maxMapSpeed) {
        speedB = speedB + .01;
    }

    positionB -= speedB;

    track.style.backgroundPosition = `${positionTrack}px`;
    if (speedTrack < maxTrackSpeed) {
        speedTrack = speedTrack + .25;
    }
    positionTrack -= speedTrack;

    if (ending === false) {
        requestAnimationFrame(animateGame);

    }
}

function stopGame() {
    maps[index].style.backgroundPosition = `${positionB}px`;
    if (speedB > 0) {
        speedB = speedB - .01;
        positionB -= speedB;
    }

    track.style.backgroundPosition = `${positionTrack}px`;
    if (speedTrack > 0) {
        speedTrack = speedTrack - .05;
        positionTrack -= speedTrack;
    }

    requestAnimationFrame(stopGame);

}

function animateTransition() {
    transition.style.transform = `translateX(${positionT}px)`;
    if (positionT === 0) {
        flag = true;
    }
    positionT -= speedT;

    if (positionT < window.innerWidth-transition.offsetWidth && flag === true) {
        maps[index].style.visibility = "hidden";
        index++;
        if (index === maps.length) {
            index = 0;
            map1.style.visibility = "visible";
            map2.style.visibility = "visible";
            map3.style.visibility = "visible";
        }
        flag = false;
    }

    if (ending === false || positionT  > -window.innerWidth - transition.offsetWidth) {
        requestAnimationFrame(animateTransition);
    }
}

function resetTransition() {
    positionT = 0;
}
let totalTime = 0;

// Function to create sparks
function createSpark(x, y) {
    const spark = document.createElement('div');
    spark.classList.add('spark');

    if (streak >= 15) {
        spark.style.backgroundColor = 'aqua';
    }
    // Randomize the speed of each spark
    const randomSpeed = Math.random() * 0.5 + 0.5; // Random speed between 0.5s and 1s
    spark.style.animationDuration = `${randomSpeed}s`;  // Set random speed for the animation

    // Set initial position of the spark
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;

    // Add the spark to the body
    document.body.appendChild(spark);

    // Remove the spark after animation completes
    setTimeout(() => {
        spark.remove();
    }, randomSpeed * 1000); // Matches the duration of the animation
}

function GameClock() {
    let ones = 0;
    let tens = 0;
    let hunds = 0;
    let thous = 0;

    setInterval(() => {
        ones++;
        totalTime++;
        if (ones === 10) {
            tens++;
            ones = 0;
            if (tens === 6) {
                hunds++;
                tens = 0;
                if (hunds === 10) {
                    thous++;
                    hunds = 0;
                }
            }
        }

        let finalTime = thous.toString() + hunds + ':' + tens + ones;
        document.getElementById('clock').innerText = finalTime;

        // Store the final time string in localStorage
        localStorage.setItem('finalTime', finalTime);

    }, 1000);
}

function animateCar() {
    car.style.left = carPosition + 'px';
    carStreak.style.transform = `translateX(${carPosition}px)`;
    carShield.style.transform = `translateX(${carPosition}px)`;

    if (ending && carSpeed < 6) {
        carSpeed += 1;
    }

    else if (carSpeed < 1 && carPosition <= window.innerWidth * positionalIndex) {
        carSpeed += 0.01;
    }

    else if (carSpeed > -1 && carPosition >= window.innerWidth * positionalIndex) {
        carSpeed -= 0.01;
    }

    carPosition += carSpeed;


    requestAnimationFrame(animateCar);
}


function performFlip() {
    if (!isFlipping) {
        isFlipping = true;
        let flipIndex = 0;
        const flipInterval = setInterval(() => {
            if (flipIndex < flipFrames.length) {
                car.src = flipFrames[flipIndex];
                flipIndex++;
            } else {
                clearInterval(flipInterval);
                isFlipping = false;
            }
        }, 100);
    }
}

window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        performFlip();
    }
});

function intro() {
    moving = true;
    moveCar();
}

function Lights() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("startGame").style.display = "none";

    light.style.animation = "slideDown 2s ease-out forwards";
    light.style.visibility = "visible";

    setTimeout(() => {
        countDown();
    }, 2000);
}


function playCountDownSound(start, end) {
    countSound.currentTime = start;
    countSound.play();

    let duration = (end - start) * 1000;
    setTimeout(() => {
        countSound.pause();
        countSound.currentTime = 0;
    }, duration);
}

function countDown() {

    let counter = 4;

    let countInterval = setInterval(() => {
        counter--;
        game_border.style.animation = "none";
        game_border.offsetWidth;
        switch (counter) {
            case 3:
                red.classList.add('active');
                game_border.style.boxShadow = "inset 0 0 50px 25px lightcoral";
                game_border.style.animation = "flashingLight 1s ease-in forwards";
                playCountDownSound(4.7, 5.7);
                countSound.p
                break;
            case 2:
                red.classList.remove('active');
                yellow.classList.add('active');
                game_border.style.boxShadow = "inset 0 0 50px 25px lightcoral";
                game_border.style.animation = "flashingLight 1s ease-in forwards";
                playCountDownSound(4.7, 5.7);
                break;
            case 1:
                yellow.classList.remove('active');
                yellow.classList.add('active');
                game_border.style.boxShadow = "inset 0 0 50px 25px lightcoral";
                game_border.style.animation = "flashingLight 1s ease-in forwards";
                playCountDownSound(4.7, 5.7);
                break;
            case 0:
                yellow.classList.remove('active');
                green.classList.add('active');
                game_border.style.boxShadow = "inset 0 0 50px 25px lightcoral";
                game_border.style.animation = "flashingLight 1s ease-in forwards";
                playCountDownSound(9.8, 10.7);

                countDown1.innerHTML = "Go!";
                startGame();
                light.style.animation = "none";
                light.offsetWidth;
                light.style.animation = "slideDown 2s reverse forwards";
                break;
            default:
                game_border.style.boxShadow = "none";
                clearInterval(countInterval);
                document.querySelector(".equation-container").style.visibility = "visible";
                countDown1.style.visibility = "hidden";
        }
        if (counter > 0) {
            countDown1.innerHTML = counter.toString();
        }

        countDown1.style.opacity = "1";
        countDown1.style.animation = "none";
        countDown1.offsetHeight;
        countDown1.style.animation = "fadeOut2 1.3s ease 1 forwards";
    }, 1300);
}

function startGame() {

    soundTrack.play();
    animateGame();
    animateCar();

    setTimeout(() => {
        animateTransition();

        setInterval(resetTransition, 20000);
    }, 15000);
    GameClock();
}

window.onload = function () {
    console.log("Window loaded!");
    intro();
};