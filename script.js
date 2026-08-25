/* =========================
   ENTRY SCREEN
========================= */

const entryScreen =
    document.querySelector("#entryScreen");

const entryButton =
    document.querySelector("#entryButton");


if (
    entryScreen &&
    entryButton
) {

    entryButton.addEventListener(
        "click",
        () => {

            entryScreen.classList.add(
                "hidden"
            );


            setTimeout(() => {

                entryScreen.remove();

            }, 850);

        }
    );

}


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
    30000
);


/* =========================
   TEMPERATURE
========================= */

const temperature =
    document.querySelector("#temperature");


/*
    Por ahora estática.
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


spotifyTrigger.addEventListener(
    "click",
    openSpotify
);


spotifyClose.addEventListener(
    "click",
    closeSpotify
);


spotifyBackdrop.addEventListener(
    "click",
    closeSpotify
);


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
