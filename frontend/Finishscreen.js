let storedTime = localStorage.getItem('finalTime') || "00:00"; // Default to "00:00" if no value exists
document.getElementById('clock').innerText = storedTime;
function timeToSeconds(timeStr) {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
}
function podium() {
    let car = document.getElementById('car');
    const totalTime = timeToSeconds(storedTime);

    // Add transition for smooth animation
    car.style.transition = 'transform 2s ease-in-out';

    if (totalTime < 30) {
        car.style.bottom = '13%';
        car.style.left = '35%';

    } else if (totalTime >= 30 && totalTime < 60) {
        car.style.bottom = '1%';
        car.style.left = '25%';
    } else if (totalTime >= 60) {
        car.style.bottom = '1%';
        car.style.left = '45%';

    }
}

// window.onload = podium();
// function Start() {
//    navigateTo("Game_animation");
// }
// function Quit() {
//     navigateTo("StartScreen");
// }
