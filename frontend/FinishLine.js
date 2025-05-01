moveSpeed = 5;
let finishLine = false;
let Finalspot = 20;

// Helper to convert "mm:ss" into total seconds
function timeToSeconds(timeStr) {
    timeStr = String(timeStr); // force it into a string
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return (isNaN(minutes) || isNaN(seconds)) ? 0 : minutes * 60 + seconds;
}

function shiftCar() {
    const carl = document.getElementById('car2');
    if (!carl) {
        console.warn('Car element not found!');
        return;
    }

    carl.style.position = 'absolute';
    carl.style.transform = 'none'; // <- Critical line to prevent shifting off-screen

    let spot = window.innerWidth * 0.9;

    if (moving) {
        if (Finalspot + moveSpeed >= spot) {
            Finalspot = spot;
            carl.style.left = Finalspot + 'px';
            moving = false;
            setTimeout(() => {
                navigateTo("finishScreen");
            }, 3000);
            return;
        }

        Finalspot += moveSpeed;
        carl.style.left = Finalspot + 'px';
        requestAnimationFrame(shiftCar);
    }
}


function finish() {
    let storedTime = localStorage.getItem("AgentP") || "00:00";
    const totalSeconds = timeToSeconds(storedTime);
    const carl = document.getElementById('car2');
console.log(storedTime);
console.log(localStorage.getItem("AgentP"));
    if (!carl) {
        console.warn('Car element not found!');
        return;
    }

    // ✅ STOP gameplay animation
    moving = false;
    carSpeed = 0;

    // ✅ Reset finish car position
    Finalspot = 20;
    carl.style.left = Finalspot + 'px';
    carl.style.position = 'absolute';
    carl.style.transform = 'none';

    // ✅ Position car vertically based on time
    if (totalSeconds > 30 && totalSeconds < 60) {
        carl.style.top = '75%';
    } else if (totalSeconds > 60) {
        carl.style.top = '85%';
    } else {
        carl.style.top = '65%';
    }

    // ✅ Start finish line movement
    moving = true;
    shiftCar();
}
