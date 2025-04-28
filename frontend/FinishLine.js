moveSpeed = 5;
moving = false;
const finish_car = document.getElementById("finish_car");
let finishLine = false;
let storedTime = localStorage.getItem('finalTime') || "00:00";

// At the top of FinishLine.js


// Convert stored time (e.g., "01:15") to seconds
function timeToSeconds(timeStr) {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
}

function shiftCar() {
    console.log(">>> shiftCar Called");
    targetPosition = window.innerWidth * 0.9;
    if (!moving) return;
    if (carPosition >= targetPosition) {
        moving = false;
        setTimeout(() => navigateTo("finishScreen"), 3000);
        return;
    }
    carPosition += moveSpeed;
    finish_car.style.left = carPosition + 'px';
    requestAnimationFrame(shiftCar);
}

function finish() {
    // Reset car position at the start of finish
    carPosition = 20;
    finish_car.style.left = carPosition + 'px';
    console.log(">>> finish");
    const totalSeconds = timeToSeconds(storedTime);
    if (totalSeconds > 30 && totalSeconds < 60) {
        finish_car.style.top = '85%';
    } else if (totalSeconds > 60) {
        finish_car.style.top = '95%';
    }
    moving = true;
    shiftCar();
}

// window.onload = finish;
