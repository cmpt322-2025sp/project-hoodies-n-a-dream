
let Baljeet = document.getElementById("clockfs").innerText;

const Ferb = document.getElementById('car3');

Baljeet = timeToSeconds(Baljeet);
Ferb.style.transition = 'transform 2s ease-in-out';

if (Baljeet < 30) {
    console.log(Baljeet);
    Ferb.style.bottom = '12%';
    Ferb.style.left = '45%';
} else if (Baljeet < 60) {
    console.log(Baljeet);
    Ferb.style.bottom = '2%';
    Ferb.style.left = '30%';
} else {
    console.log(Baljeet);
    Ferb.style.bottom = '2%';
    Ferb.style.left = '55%';
}
//window.onload = podium();
window.Restart = function() {
   navigateTo("gameAnimation");
 }
window.Pitstop = function() {
    navigateTo("startScreen");
}

