const clock = document.querySelector("#clock");

function updateClock() {

    const now = new Date();

    const hours = String(
        now.getHours()
    ).padStart(2, "0");

    const minutes = String(
        now.getMinutes()
    ).padStart(2, "0");

    clock.textContent =
        `${hours}:${minutes}`;
}

updateClock();

setInterval(
    updateClock,
    1000
);


/*
    La temperatura la dejamos estática
    por ahora.

    Después podemos conectarla a una
    API meteorológica si queremos.
*/

const temperature =
    document.querySelector("#temperature");

temperature.textContent =
    "24°C";
