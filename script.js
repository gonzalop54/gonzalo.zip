/* =========================================
   ELEMENTS
========================================= */

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

let musicStarted =
    false;

let musicWasPlaying =
    false;


/*
   Intenta iniciar la música.

   Los navegadores pueden bloquear audio
   automático con sonido hasta que el
   visitante interactúe con la página.
*/

async function startBackgroundMusic() {

    if (
        !backgroundMusic ||
        musicStarted
    ) {
        return;
    }


    try {

        await backgroundMusic.play();

        musicStarted =
            true;

        removeMusicStartListeners();

    }

    catch (error) {

        /*
           Autoplay bloqueado.

           No hacemos nada:
           empezará con la primera
           interacción del usuario.
        */

    }

}


/*
   Quitamos los listeners una vez
   que la música comenzó.
*/

function removeMusicStartListeners() {

    document.removeEventListener(
        "pointerdown",
        startBackgroundMusic
    );


    document.removeEventListener(
        "keydown",
        startBackgroundMusic
    );

}


/*
   Configuración del audio.
*/

if (backgroundMusic) {

    /*
       0.25 = 25% de volumen.

       Puedes cambiarlo:
       0.15 = muy suave
       0.25 = suave
       0.40 = más presente
    */

    backgroundMusic.volume =
        0.25;


    /*
       Primer intento:
       reproducir al cargar.
    */

    startBackgroundMusic();


    /*
       Si el navegador bloqueó autoplay,
       empezará con el primer click,
       toque o tecla.

       No hay botón ni mensaje.
    */

    document.addEventListener(
        "pointerdown",
        startBackgroundMusic,
        {
            passive: true
        }
    );


    document.addEventListener(
        "keydown",
        startBackgroundMusic
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
   Como no mostramos segundos,
   no hace falta ejecutar código
   cada segundo.
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
       Guardamos si la música ambiental
       estaba sonando.
    */

    if (backgroundMusic) {

        musicWasPlaying =
            !backgroundMusic.paused;


        /*
           Pausamos fondoreducido.mp3
           mientras Spotify está abierto.
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
       Si la música estaba reproduciéndose
       antes de abrir Spotify, continúa
       exactamente desde donde quedó.
    */

    if (
        backgroundMusic &&
        musicWasPlaying
    ) {

        try {

            await backgroundMusic.play();

            musicStarted =
                true;

        }

        catch (error) {

            /*
               Si algún navegador bloquea
               la reanudación, no rompemos
               el resto de la página.
            */

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
   ESC KEY
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
