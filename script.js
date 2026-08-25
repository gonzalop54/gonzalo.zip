/* =========================================
   ELEMENTS
========================================= */

const backgroundMusic =
    document.querySelector("#backgroundMusic");

const soundButton =
    document.querySelector("#soundButton");

const soundIcon =
    document.querySelector("#soundIcon");

const soundText =
    document.querySelector("#soundText");

const audioMark =
    document.querySelector("#audioMark");

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
   MUSIC STATE
========================================= */

let musicWasPlayingBeforeSpotify =
    false;


/* =========================================
   MUSIC SETTINGS
========================================= */

if (backgroundMusic) {

    /*
        35% de volumen.

        Puedes cambiarlo por:
        0.20 = suave
        0.35 = normal
        0.50 = fuerte
    */

    backgroundMusic.volume =
        0.35;

}


/* =========================================
   UPDATE SOUND BUTTON
========================================= */

function updateSoundUI() {

    if (!backgroundMusic) {
        return;
    }


    const playing =
        !backgroundMusic.paused;


    if (playing) {

        soundButton.classList.add(
            "playing"
        );


        audioMark.classList.add(
            "playing"
        );


        soundIcon.textContent =
            "Ⅱ";


        soundText.textContent =
            "sound";


        soundButton.setAttribute(
            "aria-label",
            "pausar música"
        );

    }

    else {

        soundButton.classList.remove(
            "playing"
        );


        audioMark.classList.remove(
            "playing"
        );


        soundIcon.textContent =
            "▶";


        soundText.textContent =
            "sound";


        soundButton.setAttribute(
            "aria-label",
            "reproducir música"
        );

    }

}


/* =========================================
   PLAY / PAUSE
========================================= */

async function toggleBackgroundMusic() {

    if (!backgroundMusic) {
        return;
    }


    if (backgroundMusic.paused) {

        try {

            await backgroundMusic.play();

        }

        catch (error) {

            console.error(
                "No se pudo reproducir fondoreducido.mp3",
                error
            );

        }

    }

    else {

        backgroundMusic.pause();

    }


    updateSoundUI();

}


/* =========================================
   SOUND BUTTON
========================================= */

if (soundButton) {

    soundButton.addEventListener(
        "click",
        toggleBackgroundMusic
    );

}


/* =========================================
   AUDIO EVENTS
========================================= */

if (backgroundMusic) {

    backgroundMusic.addEventListener(
        "play",
        updateSoundUI
    );


    backgroundMusic.addEventListener(
        "pause",
        updateSoundUI
    );


    backgroundMusic.addEventListener(
        "error",
        () => {

            console.error(
                "No se encontró o no se pudo cargar fondoreducido.mp3"
            );

        }
    );

}


updateSoundUI();


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
        Recordamos si la música estaba
        sonando antes de abrir Spotify.
    */

    if (backgroundMusic) {

        musicWasPlayingBeforeSpotify =
            !backgroundMusic.paused;


        if (
            musicWasPlayingBeforeSpotify
        ) {

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


    updateSoundUI();

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
        Solo vuelve a sonar si estaba
        sonando antes de abrir Spotify.
    */

    if (
        backgroundMusic &&
        musicWasPlayingBeforeSpotify
    ) {

        try {

            await backgroundMusic.play();

        }

        catch (error) {

            console.error(
                "No se pudo reanudar la música",
                error
            );

        }

    }


    musicWasPlayingBeforeSpotify =
        false;


    updateSoundUI();

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
