 let leaderboardtime = localStorage.getItem('finalTime') || "00:00"; // Default to "00:00" if no value exists
document.getElementById('clock').innerText = leaderboardtime;
function timeToSeconds(timeStr) {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
}
function podium() {
    const carl = document.getElementById('car3');
    const totalTime = timeToSeconds(leaderboardtime);

    // Add transition for smooth animation
    carl.style.transition = 'transform 2s ease-in-out';

    if (totalTime < 30) {
        carl.style.bottom = '12%';
        carl.style.left = '45%';
 
    } else if (totalTime >= 30 && totalTime < 60) {
        carl.style.bottom = '2%';
        carl.style.left = '30%';
    } else if (totalTime >= 60) {
        carl.style.bottom = '2%';
        carl.style.left = '50%';

    }
}
//window.onload = podium();
window.Restart = function() {
   navigateTo("gameAnimation");
 }
window.Pitstop = function() {
    navigateTo("startScreen");
}

