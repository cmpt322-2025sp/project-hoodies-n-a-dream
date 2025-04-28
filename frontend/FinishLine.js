moveSpeed = 5;
moving = false;
let finishLine = false;
targetPosition = window.innerWidth * 0.9;
carPosition = 20;

// Helper to convert "mm:ss" into total seconds
function timeToSeconds(timeStr) {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
}

function shiftCar() {
    const car = document.getElementById('car2'); // OR 'car' if you rename HTML
    if (!car) {
        console.warn('Car element not found!');
        return;
    }
    if (moving) {
        if (carPosition >= targetPosition) {
            moving = false;
            setTimeout(() => {
                navigateTo("finishScreen");
            }, 3000);
            return;
        }
        carPosition += moveSpeed;
        car.style.left = carPosition + 'px';
        requestAnimationFrame(shiftCar);
    }
}

function finish() {
    let storedTime = localStorage.getItem('finalTime') || "00:00";
    const totalSeconds = timeToSeconds(storedTime);

    const car = document.getElementById('car2'); // OR 'car'
    if (!car) {
        console.warn('Car element not found!');
        return;
    }

    if (totalSeconds > 30 && totalSeconds < 60) {
        car.style.top = '85%';
    } else if (totalSeconds > 60) {
        car.style.top = '95%';
    }

    moving = true;
    shiftCar();
}

window.addEventListener('load', finish);
