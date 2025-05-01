moveSpeed = 5;
let finishLine = false;
let Finalspot = 20;
Response.type = 'gameCompleted';
let Billy = Response.players[0].time;
let Mandy = Response.players[1].time;
let Grim = Response.players[2].time;
// Helper to convert "mm:ss" into total seconds
function timeToSeconds(timeStr) {
    timeStr = String(timeStr); // force it into a string
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return (isNaN(minutes) || isNaN(seconds)) ? 0 : minutes * 60 + seconds;
}

function shiftCar() {
    const carl = document.getElementById('car2');
    const blue = document.getElementById('Gumball');
    const purple  = document.getElementById('Darwin');
    if (!carl) {
        console.warn('Car element not found!');
        return;
    }

    carl.style.position = 'absolute';
    carl.style.transform = 'none'; // <- Critical line to prevent shifting off-screen
    blue.style.position = 'absolute';
    blue.style.transform = 'none';
    purple.style.position = 'absolute';
    purple.style.transform = 'none';
    let spot = window.innerWidth * 0.8;

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
    const carl = document.getElementById('car2');
    const blue = document.getElementById('Gumball');
    const purple  = document.getElementById('Darwin');
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
    if (Grim > Mandy && Billy < Grim) {
        carl.style.top = '75%';
    } else if(Grim < Mandy && Billy > Grim) {
        carl.style.top = '95%';
    }else if((Grim > Billy || Grim > Mandy) && (Grim < Mandy || Grim < Billy)){
        carl.style.top = '85%';
    }
        else if (Grim < Mandy && Mandy > Billy) {
        blue.style.top = '75%';
    } else if(Grim < Mandy && Mandy > Billy) {
        blue.style.top = '95%';
    } else if((Grim > Mandy || Grim > Billy) && (Grim < Billy || Grim > Mandy)) {
        blue.style.top = '85%';
    } else if(Grim < Billy && Mandy < Billy) {
        purple.style.top = '75%';
    }else if((Grim > Billy || Billy < Mandy) && (Mandy < Billy || Grim < Billy)) {
        purple.style.top = '85%';
    } else if(Grim > Billy && Mandy  > Billy) {
        purple.style.top = '95%';
    }

    // ✅ Start finish line movement
    moving = true;
    shiftCar();
}
