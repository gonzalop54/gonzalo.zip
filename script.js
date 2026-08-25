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


setInterval(
    updateClock,
    1000
);


/* =========================
   TEMPERATURE
========================= */

/*
    Por ahora dejamos la temperatura
    estática.

    Después podemos hacer que detecte
    automáticamente la temperatura
    real.
*/

const temperature =
    document.querySelector("#temperature");


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


/* CLICK SPOTIFY */

spotifyTrigger.addEventListener(
    "click",
    openSpotify
);


/* CLICK X */

spotifyClose.addEventListener(
    "click",
    closeSpotify
);


/* CLICK OUTSIDE */

spotifyBackdrop.addEventListener(
    "click",
    closeSpotify
);


/* ESC KEY */

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
