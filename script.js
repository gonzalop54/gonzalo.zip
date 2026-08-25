/* =========================================
   ELEMENTS
========================================= */

const entryScreen =
    document.querySelector("#entryScreen");

const entryButton =
    document.querySelector("#entryButton");

const backgroundMusic =
    document.querySelector("#backgroundMusic");

const clock =
    document.querySelector("#clock");

const temperature =
    document.querySelector("#temperature");

const spotifyTrigger =
    document.querySelector("#spotifyTrigger");

const spotifyModal =
    document.querySelector("#spotifyModal");

const spotifyClose =
    document.querySelector("#spotifyClose");

const spotifyBackdrop =
    document.querySelector("#spotifyBackdrop");


/* =========================================
   BACKGROUND MUSIC
========================================= */

/*
   Volumen:
   0 = silencio
   1 = máximo

   0.25 queda bastante bien como
   música ambiental.
*/

if (backgroundMusic) {

    backgroundMusic.volume =
        0.25;

}


/*
   Guardamos si la música estaba
   reproduciéndose antes de abrir
   Spotify.

   Así solo la reanudamos si
   realmente estaba sonando.
*/

let musicWasPlaying =
    false;


/* =========================================
   ENTRY SCREEN
========================================= */

async function enterWebsite() {

    /*
       Marcamos la página como activa.
       Recién ahora comienzan las
       animaciones de la interfaz.
    */

    document.body.classList.add(
        "entered"
    );


    /*
       Empezar música.

       Como ocurre directamente después
       del click del usuario, los navegadores
       permiten reproducir audio.
    */

    if (backgroundMusic) {

        try {

            await backgroundMusic.play();

        }

        catch (error) {

            console.log(
                "No se pudo iniciar el audio:",
                error
            );

        }

    }


    /*
       Ocultamos pantalla inicial.
    */

    if (entryScreen) {

        entryScreen.classList.add(
            "hidden"
        );


        setTimeout(() => {

            entryScreen.remove();

        }, 800);

    }

}


if (
    entryButton &&
    entryScreen
) {

    entryButton.addEventListener(
        "click",
        enterWebsite,
        {
            once: true
        }
    );

}


/* =========================================
   CLOCK
========================================= */

function updateClock() {

    const now =
        new Date();


    const hours =
        String(
            now.getHours()
        ).padStart(
            2,
            "0"
        );


    const minutes =
        String(
            now.getMinutes()
        ).padStart(
            2,
            "0"
        );


    if (clock) {

        clock.textContent =
            `${hours}:${minutes}`;

    }

}


updateClock();


/*
   Solo necesitamos comprobar cada
   30 segundos.
*/

setInterval(
    updateClock,
    30000
);


/* =========================================
   TEMPERATURE
========================================= */

if (temperature) {

    temperature.textContent =
        "24°C";

}


/* =========================================
   OPEN SPOTIFY
========================================= */

function openSpotify() {

    if (!spotifyModal) {
        return;
    }


    /*
       Comprobamos si la música estaba
       sonando.
    */

    if (backgroundMusic) {

        musicWasPlaying =
            !backgroundMusic.paused;


        /*
           Pausar la música ambiental.
        */

        if (musicWasPlaying) {

            backgroundMusic.pause();

        }

    }


    spotifyModal.classList.add(
        "active"
    );


    spotifyModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* =========================================
   CLOSE SPOTIFY
========================================= */

async function closeSpotify() {

    if (!spotifyModal) {
        return;
    }


    spotifyModal.classList.remove(
        "active"
    );


    spotifyModal.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
       Si la música estaba sonando
       antes de abrir Spotify,
       continúa desde el mismo punto.
    */

    if (
        backgroundMusic &&
        musicWasPlaying
    ) {

        try {

            await backgroundMusic.play();

        }

        catch (error) {

            console.log(
                "No se pudo reanudar el audio:",
                error
            );

        }

    }


    musicWasPlaying =
        false;

}


/* =========================================
   SPOTIFY EVENTS
========================================= */

if (spotifyTrigger) {

    spotifyTrigger.addEventListener(
        "click",
        openSpotify
    );

}


if (spotifyClose) {

    spotifyClose.addEventListener(
        "click",
        closeSpotify
    );

}


if (spotifyBackdrop) {

    spotifyBackdrop.addEventListener(
        "click",
        closeSpotify
    );

}


/* =========================================
   ESC
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            spotifyModal &&
            spotifyModal.classList.contains(
                "active"
            )
        ) {

            closeSpotify();

        }

    }
);


/* =========================================
   PAGE VISIBILITY
========================================= */

/*
   Si el usuario cambia de pestaña,
   dejamos que el navegador maneje
   normalmente el audio.

   No hacemos cálculos ni animaciones
   adicionales.
*/
