// Author: Rasheed & Keli'i
//Made: 2/17/2025
//Update:2/25/2025
//Purpose: Car movement and game functions

const carElements = document.querySelectorAll('#car, #car1, #car2'); // Add more IDs if needed
const orangeCar = document.getElementById("orangeCar");
const purpleCar = document.getElementById("purpleCar");
const blueCar = document.getElementById("blueCar");
const playerCount = document.getElementById("playerCount");

const flipFrames = ['../assets/Car6.png', '../assets/Car7.png', '../assets/Car8.png', '../assets/Car1.png'];
let
    Speed = 5;
let isFlipping = false;
let moving = false;
let introPlaying = true;
let ones = 0;
let tens = 0;
let hunds = 0;
let thous = 0;
let targetPosition = window.innerWidth * 0.10;
let leaderboardtime = localStorage.getItem("Doof");
//let carPosition = 0;
let orangeCarPosition = -10;
let purpleCarPosition = -10;
let blueCarPosition = -10;
let orangeCarSpeed = 0;
let purpleCarSpeed = 0;
let blueCarSpeed = 0;
let streakPosition = 0;

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
let positionalIndex = 0.15; //The point where the car is bounded too, where its acceleration changes from + and -
let orangeCarIndex = 0.15;
let purpleCarIndex = 0.15;
let blueCarIndex = 0.15;
let orangeCarEnding = false;
let purpleCarEnding = false;
let blueCarEnding = false;
let player1Name = document.getElementById("player1Name");
let player2Name = document.getElementById("player2Name");
let player3Name = document.getElementById("player3Name");
let currentPlayerEnded = false;

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
let middleCar = document.querySelector('.middleCar');
let bottomCar = document.querySelector('.bottomCar');
let topCar = document.querySelector('.topCar');

playerCountValue = playerCount.value;
let previousValue = 0;

function createHostName(updateResponse) {
    if (updateResponse.players[0].name !== '***'){
        player1Name.innerHTML = updateResponse.players[0].name;
    }
}

function createHostName(updateResponse) {
    if (updateResponse.players[0].name !== '***') {
        player1Name.innerHTML = updateResponse.players[0].name;
    }
}


function createPlayerPositions(updatedResponse) {
    let lengthOfPlayerArray = updatedResponse.players.length;
    console.log('>>>CreatePlayerPositions Triggered!!');

    let players = updatedResponse.players;

    topCar.style.visibility = 'hidden';
    orangeCar.classList.remove('topCar');
    purpleCar.classList.remove('middleCar');
    blueCar.classList.remove('bottomCar');

    console.log(lengthOfPlayerArray);
    if (players[0].name !== '***') {
        player1Name.innerHTML = players[0].name;
    }

    if (lengthOfPlayerArray === 2) {
        document.getElementById("preRaceCarModel").src = "../assets/PurpleCar-1.png";
        document.getElementById("startRaceButton").style.display = "none";
        document.getElementById("waiting").style.visibility = "visible";
        document.getElementById("room-code").style.display = "none";
        player2Name.innerHTML = players[1].name;
        fireStreaks = document.querySelectorAll('#p2_model .fireStreak')
        console.log(">>>> 2")
        orangeCar.classList.add('middleCar');
        purpleCar.classList.add('topCar');
        blueCar.classList.add('bottomCar');
        // Use specific element refs for visibility
        middleCar  = document.querySelector('.middleCar');
        bottomCar  = document.querySelector('.bottomCar');
        topCar     = document.querySelector('.topCar');

        topCar.style.visibility = "visible"; // top
        middleCar.style.visibility = "visible"; // middle
        bottomCar.style.visibility  = "hidden";  // bottom
        currentPlayer = 1;
    }
    else if (lengthOfPlayerArray === 3) {
        document.getElementById("preRaceCarModel").src = "../assets/BlueCar-4.png";
        document.getElementById("startRaceButton").style.display = "none";
        document.getElementById("waiting").style.visibility = "visible";
        document.getElementById("room-code").style.display = "none";
        fireStreaks = document.querySelectorAll('#p3_model .fireStreak')
        player2Name.innerHTML = players[1].name;
        player3Name.innerHTML = players[2].name;
        console.log(">>>> 3")
        orangeCar.classList.add('bottomCar');
        purpleCar.classList.add('middleCar');
        blueCar.classList.add('topCar');

         middleCar = document.querySelector('.middleCar');
         bottomCar = document.querySelector('.bottomCar');
         topCar = document.querySelector('.topCar');


        bottomCar.style.visibility = "visible";
        middleCar.style.visibility = "visible";
        topCar.style.visibility = "visible";
        currentPlayer = 2;
    }
    numberOfPlayers = lengthOfPlayerArray;
}

function updatePlayerCount(updatedResponse) {
    let players = updatedResponse.players;

    middleCar = document.querySelector('.middleCar');
    bottomCar = document.querySelector('.bottomCar');
    topCar = document.querySelector('.topCar');

    console.log('We made it to updatePlayerCount Function!!!!!!!!!!');
    console.log('number if Players:' + numberOfPlayers);
    if (numberOfPlayers === 3) {
        bottomCar.style.visibility = 'visible';
        player3Name.innerHTML = players[2].name;
    }
    else if(numberOfPlayers === 2) {
        console.log("We made it again");
        player2Name.innerHTML = players[1].name;
        middleCar.style.visibility = 'visible';
    }

}

function updatePlayerPosition(updateScoreReport) {
    let players = updateScoreReport.players;
    let numOfPlys = players.length;

    orangeCarIndex = (0.15 + (players[0].score / 2) * 0.05);
    if (numOfPlys >= 2) {
        purpleCarIndex = (0.15 + (players[1].score / 2) * 0.05);
    }
    if (numOfPlys >= 3) {
        blueCarIndex = (0.15 + (players[2].score / 2) * 0.05);
    }
}

function playersEnding(updatedPlayersEnded) {
    console.log('Player Ended!!!!!!!!');
    // Include only players whose time is a valid finish time (not "NF")
    const finishedPlayers = updatedPlayersEnded.players.filter(p => p.time !== 'NF');
    // Sort by time ascending (fastest first)
    finishedPlayers.sort((a, b) => {
        const [minA, secA] = a.time.split(':').map(Number);
        const [minB, secB] = b.time.split(':').map(Number);
        return (minA * 60 + secA) - (minB * 60 + secB);
    });
    // Clear previous leaderboard entries
    for (let i = 1; i <= 3; i++) {
        document.querySelector(`#row${i} .column1`).innerHTML = '';
        document.querySelector(`#row${i} .column2`).innerHTML = '';
    }
    // Populate leaderboard rows with sorted finishers
    finishedPlayers.forEach((player, index) => {
        const rowNum = index + 1;
        document.querySelector(`#row${rowNum} .column1`).innerHTML = player.name;
        document.querySelector(`#row${rowNum} .column2`).innerHTML = player.time;
    });
    // Set ending flags on cars that have finished
    // Match based on original player order: index 0=orange, 1=purple, 2=blue
    orangeCarEnding = finishedPlayers.some(p => p === updatedPlayersEnded.players[0]);
    purpleCarEnding = finishedPlayers.some(p => p === updatedPlayersEnded.players[1]);
    blueCarEnding   = finishedPlayers.some(p => p === updatedPlayersEnded.players[2]);
}

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

    requestAnimationFrame(animateGame);

}
/*
function stopGame() {
    leaderboardtime = localStorage.getItem("Doof");
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
 */

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
let totalTime = 0;

// Function to create sparks
function createPlayer2 () {
    const purpleCar = document.createElement("img");
    purpleCar.src = "../assets/PurpleCar-1.png";
    purpleCar.id = "purpleCar";
    purpleCar.classList.add('car');
}
function createPlayer3 () {
    const blueCar = document.createElement("img");
    blueCar.src = "../assets/BlueCar-4.png";
    blueCar.id = "blueCar";
    blueCar.classList.add('car');
}
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
    const clockInterval = setInterval(() => {
        // totalTime++;
        ones++;
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

        window.finalTime = thous.toString() + hunds.toString() + ':' + tens.toString() + ones.toString();
        document.getElementById('clock').innerText = finalTime;
        if (currentPlayerEnded === true) {
            clearInterval(clockInterval);
        }
        //document.getElementById('clockfs').innerText = finalTime;
    }, 1000);
}
function animateOrangeCar() {
    orangeCar.style.left = orangeCarPosition + 'px';

    if (orangeCarEnding && orangeCarSpeed < 6) {
        orangeCarSpeed += 1;
    }

    else if (orangeCarSpeed < 1 && orangeCarPosition <= window.innerWidth * orangeCarIndex) {
        orangeCarSpeed += 0.01;
    }

    else if (orangeCarSpeed > -1 && orangeCarPosition >= window.innerWidth * orangeCarIndex) {
        orangeCarSpeed -= 0.01;
    }

    orangeCarPosition += orangeCarSpeed;

    if (currentPlayer === 0) {
        streakPosition += orangeCarSpeed;
    }

    requestAnimationFrame(animateOrangeCar);
}
function animatePurpleCar() {
    purpleCar.style.left = purpleCarPosition + 'px';

    if (purpleCarEnding && purpleCarSpeed < 6) {
        purpleCarSpeed += 1;
    }

    else if (purpleCarSpeed < 1 && purpleCarPosition <= window.innerWidth * purpleCarIndex) {
        purpleCarSpeed += 0.01;
    }

    else if (purpleCarSpeed > -1 && purpleCarPosition >= window.innerWidth * purpleCarIndex) {
        purpleCarSpeed -= 0.01;
    }

    purpleCarPosition += purpleCarSpeed;

    if (currentPlayer === 1) {
        streakPosition += purpleCarSpeed;
    }

    requestAnimationFrame(animatePurpleCar);
}
function animateBlueCar() {
    blueCar.style.left = blueCarPosition + 'px';

    if (blueCarEnding && blueCarSpeed < 6) {
        blueCarSpeed += 1;
    }

    else if (blueCarSpeed < 1 && blueCarPosition <= window.innerWidth * blueCarIndex) {
        blueCarSpeed += 0.01;
    }

    else if (blueCarSpeed > -1 && blueCarPosition >= window.innerWidth * blueCarIndex) {
        blueCarSpeed -= 0.01;
    }

    blueCarPosition += blueCarSpeed;

    if (currentPlayer === 2) {
        streakPosition += blueCarSpeed;
    }
    requestAnimationFrame(animateBlueCar);
}

function animateCarStreaks () {
    carStreak.style.transform = `translateX(${streakPosition}px)`;
    carShield.style.transform = `translateX(${streakPosition}px)`;
    requestAnimationFrame(animateCarStreaks);
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
    //moveCar();
}

function Lights() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("startRaceButton").style.display = "none";
    document.getElementById("waiting").style.display = "none";
    document.getElementById("room-code").style.display = "none";
    document.getElementById("preRaceCarModel").style.display = "none";

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

/*
function moveCar() {
    if (moving) {
        if (introPlaying && carPosition >= targetPosition) {
            moving = false;
            introPlaying = false;
            return;
        }
        carPosition += moveSpeed;
        carElements.forEach(car => {
            orangeCar.style.left = carPosition + 'vw';
            purpleCar.style.left = carPosition + 'vw';
            blueCar.style.left = carPosition + 'vw';
        });
        requestAnimationFrame(moveCar);
    }
}
 */

function countDown() {
    console.log("countDown");
    let counter = 4;

    let countInterval = setInterval(() => {
        counter--;
        game_border.style.animation = "none";
        game_border.offsetWidth;
        switch (counter) {
            case 3:
                console.log(counter);
                red.classList.add('active');
                game_border.style.boxShadow = "inset 0 0 50px 25px lightcoral";
                game_border.style.animation = "flashingLight 1s ease-in forwards";
                playCountDownSound(4.7, 5.7);
                countSound.p
                break;
            case 2:
                console.log(counter);
                red.classList.remove('active');
                yellow.classList.add('active');
                game_border.style.boxShadow = "inset 0 0 50px 25px lightcoral";
                game_border.style.animation = "flashingLight 1s ease-in forwards";
                playCountDownSound(4.7, 5.7);
                break;
            case 1:
                console.log(counter);
                yellow.classList.remove('active');
                yellow.classList.add('active');
                game_border.style.boxShadow = "inset 0 0 50px 25px lightcoral";
                game_border.style.animation = "flashingLight 1s ease-in forwards";
                playCountDownSound(4.7, 5.7);
                break;
            case 0:
                console.log(counter);
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
                console.log(counter);
                game_border.style.boxShadow = "none";
                clearInterval(countInterval);
                document.querySelector(".equation-container").style.visibility = "visible";
                document.querySelector(".button-container").style.visibility = "visible";
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

function createLeaderBoard() {
    clock.style.display = "none";
    document.querySelector('.equation-container').style.display = "none";
    document.querySelector('.button-container').style.display = "none";
    document.querySelector('.playersInGameContainer').style.display = "none";
    document.querySelector('table').style.visibility = "visible";


}

function startGame() {

    soundTrack.play();
    animateGame();
    orangeCar.style.animation = "none";
    purpleCar.style.animation = "none";
    blueCar.style.animation = "none";
    animateOrangeCar();
    animatePurpleCar();
    animateBlueCar();
    animateCarStreaks();

    setTimeout(() => {
        animateTransition();

        setInterval(resetTransition, 20000);
    }, 15000);

    GameClock();
}
