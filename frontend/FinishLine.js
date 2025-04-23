let moveSpeed = 5;
let moving = false;
let finishLine = false;
const targetPosition = window.innerWidth * 0.9;
let carPosition = 20;
let storedTime = localStorage.getItem('finalTime') || "00:00";

// Convert stored time (e.g., "01:15") to seconds
function timeToSeconds(timeStr) {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
}

function moveCar() {
    if (moving) {
        if (carPosition >= targetPosition) {
            moving = false;
            setTimeout(() => {
                window.location.href = "Finishscreen.html";
            }, 3000);
            return;
        }
    }
    carPosition += moveSpeed;
    car.style.left = carPosition + 'px';
    requestAnimationFrame(moveCar);
}

function finish() {
    const totalSeconds = timeToSeconds(storedTime);
    if (totalSeconds > 30 && totalSeconds < 60) {
        document.getElementById('car').style.top = '85%';
    } else if (totalSeconds > 60) {
        document.getElementById('car').style.top = '95%';
    }
    moving = true;
    moveCar();
}

window.onload = finish;