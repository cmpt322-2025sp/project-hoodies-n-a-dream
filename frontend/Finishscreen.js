 let leaderboardtime = localStorage.getItem('finalTime') || "00:00"; // Default to "00:00" if no value exists
document.getElementById('clock').innerText = leaderboardtime;
function timeToSeconds(timeStr) {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
}
function podium() {
    const last_car = document.getElementById('last_car');
    const totalTime = timeToSeconds(leaderboardtime);

    // Add transition for smooth animation
    last_car.style.transition = 'transform 2s ease-in-out';

    if (totalTime < 30) {
        last_car.style.bottom = '12%';
        last_car.style.left = '45%';
 
    } else if (totalTime >= 30 && totalTime < 60) {
        last_car.style.bottom = '2%';
        last_car.style.left = '30%';
    } else if (totalTime >= 60) {
        last_car.style.bottom = '2%';
        last_car.style.left = '50%';

    }
}
//window.onload = podium();
window.Restart = function() {
   navigateTo("gameAnimation");
 }
window.Pitstop = function() {
    navigateTo("startScreen");
}

