// Author: Rasheed & Keli'i
//Made: 2/17/2025
//Update:2/25/2025
//Purpose: Car movement and game functions

const car = document.getElementById('car');
const flipFrames = ['../Assets/Car6.png', '../Assets/Car7.png', '../Assets/Car8.png'];
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
let speedT = 31; // speed of Transition background

let maps = [map1, map2, map3];
let index = 0;

let flag = true; //To make sure index is changed once when needed

function animateMap() {
    maps[index].style.backgroundPosition = `${positionB}px`;
    if (speedB < 1) {
        speedB = speedB + .01;
    }
    positionB -= speedB;

    track.style.backgroundPosition = `${positionTrack}px`;
    if (speedTrack < 30) {
        speedTrack = speedTrack + .25;
    }
    positionTrack -= speedTrack;

    requestAnimationFrame(animateMap);
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

    requestAnimationFrame(animateTransition);
}

function resetTransition() {
    positionT = 0;
}

function GameClock() {
    let ones = 0;
    let tens = 0;
    let hunds = 0;
    let thous = 0;

    setInterval(() => {
        ones++;
        if (ones === 10) {
            tens++;
            ones = 0;
            if (tens === 6) {
                hunds++;
                tens = 0
                if (hunds === 10) {
                    thous++;
                    hunds = 0;
                }
            }
        }
        document.getElementById('clock').innerText = thous.toString() + hunds + ':' + tens + ones;
    }, 1000);
}

function moveCar() {
    if (moving) {
        if (introPlaying && carPosition >= targetPosition) {
            moving = false;
            introPlaying = false;
            return;
        }
        carPosition += moveSpeed;
        car.style.left = carPosition + 'px';
        requestAnimationFrame(moveCar);
    }
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

function removeOverlay() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("removeOverlayBtn").style.display = "none";

    maps[index].style.visibility = "visible";
    animateMap();

    setTimeout(() => {
        animateTransition();
        setInterval(resetTransition, 25000);
    }, 30000);
    GameClock();
}

window.onload = function () {
    console.log("Window loaded!");
    intro();
};