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
   TEMPERATURE — BUENOS AIRES
========================= */

const temperature =
    document.querySelector("#temperature");


async function updateTemperature() {

    try {

        const response = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=-34.6037&longitude=-58.3816&current=temperature_2m&timezone=America%2FArgentina%2FBuenos_Aires"
        );


        if (!response.ok) {
            throw new Error("Weather request failed");
        }


        const data =
            await response.json();


        const currentTemperature =
            Math.round(
                data.current.temperature_2m
            );


        temperature.textContent =
            `${currentTemperature}°C`;

    }

    catch (error) {

        /*
            Si por algún motivo no se puede
            consultar el clima, mostramos "--"
            en vez de romper la página.
        */

        temperature.textContent =
            "--°C";

        console.error(
            "No se pudo obtener la temperatura:",
            error
        );

    }

}


/* Obtener temperatura al cargar */

updateTemperature();


/*
    Actualizar cada 15 minutos.
*/

setInterval(
    updateTemperature,
    15 * 60 * 1000
);


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
