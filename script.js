/* =========================
   CLOCK
========================= */

const clock =
    document.querySelector("#clock");


function updateClock() {

    const now =
        new Date();


    const hours =
        String(
            now.getHours()
        ).padStart(2, "0");


    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");


    clock.textContent =
        `${hours}:${minutes}`;
}


updateClock();


/*
    Como solo mostramos horas y minutos,
    no necesitamos actualizarlo cada segundo.
    Una vez cada 30 segundos es suficiente.
*/

setInterval(
    updateClock,
    30000
);


/* =========================
   TEMPERATURE
========================= */

const temperature =
    document.querySelector("#temperature");


/*
    Por ahora estática.

    Más adelante podemos hacer que
    muestre la temperatura real.
*/

temperature.textContent =
    "24°C";


/* =========================
   SPOTIFY MODAL
========================= */

const spotifyTrigger =
    document.querySelector("#spotifyTrigger");


const spotifyModal =
    document.querySelector("#spotifyModal");


const spotifyClose =
    document.querySelector("#spotifyClose");


const spotifyBackdrop =
    document.querySelector("#spotifyBackdrop");


/* OPEN */

function openSpotify() {

    spotifyModal.classList.add(
        "active"
    );


    spotifyModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";
}


/* CLOSE */

function closeSpotify() {

    spotifyModal.classList.remove(
        "active"
    );


    spotifyModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";
}


/* SPOTIFY BUTTON */

spotifyTrigger.addEventListener(
    "click",
    openSpotify
);


/* CLOSE BUTTON */

spotifyClose.addEventListener(
    "click",
    closeSpotify
);


/* CLICK OUTSIDE */

spotifyBackdrop.addEventListener(
    "click",
    closeSpotify
);


/* ESC */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            spotifyModal.classList.contains(
                "active"
            )
        ) {

            closeSpotify();

        }

    }
);

/* =========================
   BLINK INTRO
========================= */

const blinkIntro =
    document.querySelector("#blinkIntro");


if (blinkIntro) {

    setTimeout(() => {

        blinkIntro.remove();

    }, 5000);

}
