"use strict";


/* ========================================
   ELEMENTOS GENERALES
   ======================================== */

const arena =
    document.querySelector("#arena");

const modeScreen =
    document.querySelector("#mode-screen");

const flickScreen =
    document.querySelector("#flick-screen");

const reactionScreen =
    document.querySelector("#reaction-screen");

const flickResults =
    document.querySelector("#flick-results");

const reactionResults =
    document.querySelector("#reaction-results");

const modeCards =
    document.querySelectorAll("[data-mode]");

const backModeButtons =
    document.querySelectorAll(".back-mode-button");

const goModesButtons =
    document.querySelectorAll(".go-modes");

const topStats =
    document.querySelector("#top-stats");

const bottomStats =
    document.querySelector("#bottom-stats");


/* ========================================
   FLICK
   ======================================== */

const target =
    document.querySelector("#target");

const countdown =
    document.querySelector("#countdown");

const flickStartButton =
    document.querySelector("#flick-start-button");

const flickRestartButton =
    document.querySelector("#flick-restart-button");

const targetCountSelect =
    document.querySelector("#target-count");

const targetSizeSelect =
    document.querySelector("#target-size");

const scoreElement =
    document.querySelector("#score");

const accuracyElement =
    document.querySelector("#accuracy");

const timerElement =
    document.querySelector("#timer");

const hitsElement =
    document.querySelector("#hits");

const missesElement =
    document.querySelector("#misses");

const totalTargetsElement =
    document.querySelector("#total-targets");

const resultScore =
    document.querySelector("#result-score");

const resultAccuracy =
    document.querySelector("#result-accuracy");

const resultHits =
    document.querySelector("#result-hits");

const resultMisses =
    document.querySelector("#result-misses");

const resultAverage =
    document.querySelector("#result-average");

const resultBest =
    document.querySelector("#result-best");

const personalBest =
    document.querySelector("#personal-best");


let flickRunning = false;

let hits = 0;
let misses = 0;

let totalTargets = 20;

let gameStartedAt = 0;
let targetSpawnedAt = 0;

let reactionTimes = [];

let animationFrame = null;


/* ========================================
   REACTION
   ======================================== */

const reactionArea =
    document.querySelector("#reaction-area");

const reactionTarget =
    document.querySelector("#reaction-target");

const reactionMessage =
    document.querySelector("#reaction-message");

const reactionRoundsSelect =
    document.querySelector("#reaction-rounds");

const reactionStartButton =
    document.querySelector("#reaction-start-button");

const reactionRestartButton =
    document.querySelector("#reaction-restart-button");

const reactionAverage =
    document.querySelector("#reaction-average");

const reactionBest =
    document.querySelector("#reaction-best");

const reactionWorst =
    document.querySelector("#reaction-worst");

const reactionResultRounds =
    document.querySelector("#reaction-result-rounds");

const reactionFalseStarts =
    document.querySelector("#reaction-false-starts");

const reactionRecord =
    document.querySelector("#reaction-record");


let reactionRunning = false;
let reactionReady = false;

let reactionRound = 0;
let reactionTotalRounds = 5;

let reactionResultsArray = [];

let falseStarts = 0;

let reactionAppearedAt = 0;

let reactionTimeout = null;


/* ========================================
   UTILIDADES
   ======================================== */

function sleep(milliseconds) {
    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );
}


function hideAllScreens() {
    modeScreen.classList.add("hidden");
    flickScreen.classList.add("hidden");
    reactionScreen.classList.add("hidden");

    flickResults.classList.add("hidden");
    reactionResults.classList.add("hidden");

    countdown.classList.add("hidden");

    target.classList.add("hidden");

    reactionArea.classList.add("hidden");
    reactionTarget.classList.add("hidden");
}


function showModeScreen() {
    flickRunning = false;
    reactionRunning = false;
    reactionReady = false;

    clearTimeout(reactionTimeout);

    if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
    }

    hideAllScreens();

    modeScreen.classList.remove("hidden");

    topStats.classList.add("hidden");
    bottomStats.classList.add("hidden");
}


/* ========================================
   SELECTOR DE MODOS
   ======================================== */

modeCards.forEach(card => {

    card.addEventListener(
        "click",
        () => {

            const mode =
                card.dataset.mode;

            hideAllScreens();

            if (mode === "flick") {
                flickScreen.classList.remove("hidden");
            }

            if (mode === "reaction") {
                reactionScreen.classList.remove("hidden");
            }

        }
    );

});


backModeButtons.forEach(button => {

    button.addEventListener(
        "click",
        showModeScreen
    );

});


goModesButtons.forEach(button => {

    button.addEventListener(
        "click",
        showModeScreen
    );

});


/* ========================================
   FLICK
   ======================================== */

async function startFlickGame() {

    hideAllScreens();

    topStats.classList.remove("hidden");
    bottomStats.classList.remove("hidden");

    flickRunning = false;

    hits = 0;
    misses = 0;

    reactionTimes = [];

    totalTargets =
        Number(
            targetCountSelect.value
        );

    const targetSize =
        Number(
            targetSizeSelect.value
        );

    target.style.width =
        `${targetSize}px`;

    target.style.height =
        `${targetSize}px`;

    totalTargetsElement.textContent =
        totalTargets;

    resetFlickStats();

    countdown.classList.remove("hidden");

    for (const number of [3, 2, 1]) {

        countdown.textContent =
            number;

        await sleep(650);

    }

    countdown.textContent =
        "GO";

    await sleep(350);

    countdown.classList.add("hidden");

    flickRunning = true;

    gameStartedAt =
        performance.now();

    spawnTarget();

    animationFrame =
        requestAnimationFrame(
            updateTimer
        );
}


function spawnTarget() {

    if (hits >= totalTargets) {

        finishFlickGame();

        return;
    }

    const arenaRect =
        arena.getBoundingClientRect();

    const targetSize =
        target.offsetWidth;

    const radius =
        targetSize / 2;

    const padding =
        radius + 15;

    const maxX =
        arenaRect.width -
        padding;

    const maxY =
        arenaRect.height -
        padding;

    const x =
        padding +
        Math.random() *
        (
            maxX -
            padding
        );

    const y =
        padding +
        Math.random() *
        (
            maxY -
            padding
        );

    target.style.left =
        `${x}px`;

    target.style.top =
        `${y}px`;

    target.classList.remove("hidden");

    targetSpawnedAt =
        performance.now();
}


function hitTarget(event) {

    if (!flickRunning) {
        return;
    }

    event.stopPropagation();

    const reactionTime =
        performance.now() -
        targetSpawnedAt;

    reactionTimes.push(
        reactionTime
    );

    hits += 1;

    hitsElement.textContent =
        hits;

    updateFlickStats();

    target.classList.add("hidden");

    spawnTarget();
}


function registerMiss(event) {

    if (!flickRunning) {
        return;
    }

    if (event.target === target) {
        return;
    }

    misses += 1;

    missesElement.textContent =
        misses;

    updateFlickStats();
}


function calculateAccuracy() {

    const totalShots =
        hits + misses;

    if (totalShots === 0) {
        return 100;
    }

    return (
        hits /
        totalShots
    ) * 100;
}


function calculateScore() {

    if (
        reactionTimes.length === 0
    ) {
        return 0;
    }

    const average =
        reactionTimes.reduce(
            (sum, value) =>
                sum + value,
            0
        ) /
        reactionTimes.length;

    const accuracy =
        calculateAccuracy();

    const speedScore =
        Math.max(
            0,
            1500 - average
        );

    return Math.round(
        speedScore *
        (
            accuracy / 100
        ) *
        hits
    );
}


function updateFlickStats() {

    const accuracy =
        calculateAccuracy();

    accuracyElement.textContent =
        `${accuracy.toFixed(1)}%`;

    scoreElement.textContent =
        calculateScore();
}


function updateTimer() {

    if (!flickRunning) {
        return;
    }

    const elapsed =
        (
            performance.now() -
            gameStartedAt
        ) / 1000;

    timerElement.textContent =
        elapsed.toFixed(2);

    animationFrame =
        requestAnimationFrame(
            updateTimer
        );
}


function finishFlickGame() {

    flickRunning = false;

    target.classList.add("hidden");

    if (animationFrame !== null) {

        cancelAnimationFrame(
            animationFrame
        );

    }

    const finalScore =
        calculateScore();

    const accuracy =
        calculateAccuracy();

    const average =
        reactionTimes.reduce(
            (sum, value) =>
                sum + value,
            0
        ) /
        reactionTimes.length;

    const best =
        Math.min(
            ...reactionTimes
        );

    resultScore.textContent =
        finalScore;

    resultAccuracy.textContent =
        `${accuracy.toFixed(1)}%`;

    resultHits.textContent =
        hits;

    resultMisses.textContent =
        misses;

    resultAverage.textContent =
        `${Math.round(average)} ms`;

    resultBest.textContent =
        `${Math.round(best)} ms`;

    updateFlickPersonalBest(
        finalScore
    );

    topStats.classList.add("hidden");
    bottomStats.classList.add("hidden");

    flickResults.classList.remove("hidden");
}


function updateFlickPersonalBest(score) {

    const stored =
        Number(
            localStorage.getItem(
                "aimzip-flick-best"
            )
        );

    if (
        !stored ||
        score > stored
    ) {

        localStorage.setItem(
            "aimzip-flick-best",
            String(score)
        );

        personalBest.textContent =
            score;

        return;
    }

    personalBest.textContent =
        stored;
}


function loadFlickPersonalBest() {

    const stored =
        localStorage.getItem(
            "aimzip-flick-best"
        );

    if (stored) {

        personalBest.textContent =
            stored;

    }
}


function resetFlickStats() {

    scoreElement.textContent =
        "0";

    accuracyElement.textContent =
        "100%";

    timerElement.textContent =
        "0.00";

    hitsElement.textContent =
        "0";

    missesElement.textContent =
        "0";
}


/* ========================================
   REACTION
   ======================================== */

function startReactionGame() {

    hideAllScreens();

    topStats.classList.add("hidden");
    bottomStats.classList.add("hidden");

    reactionArea.classList.remove("hidden");

    reactionRunning = true;
    reactionReady = false;

    reactionRound = 0;

    reactionTotalRounds =
        Number(
            reactionRoundsSelect.value
        );

    reactionResultsArray = [];
    falseStarts = 0;

    reactionMessage.textContent =
        "Preparado...";

    startReactionRound();
}


function startReactionRound() {

    if (
        reactionRound >=
        reactionTotalRounds
    ) {

        finishReactionGame();

        return;
    }

    reactionReady = false;

    reactionTarget.classList.add("hidden");

    reactionMessage.textContent =
        `Ronda ${reactionRound + 1} / ${reactionTotalRounds} · esperá...`;

    const delay =
        1200 +
        Math.random() *
        2800;

    reactionTimeout =
        setTimeout(
            showReactionTarget,
            delay
        );
}


function showReactionTarget() {

    if (!reactionRunning) {
        return;
    }

    const arenaRect =
        arena.getBoundingClientRect();

    const size =
        110;

    const padding =
        size / 2 + 30;

    const x =
        padding +
        Math.random() *
        (
            arenaRect.width -
            padding * 2
        );

    const y =
        padding +
        Math.random() *
        (
            arenaRect.height -
            padding * 2
        );

    reactionTarget.style.left =
        `${x}px`;

    reactionTarget.style.top =
        `${y}px`;

    reactionMessage.textContent =
        "";

    reactionTarget.classList.remove("hidden");

    reactionReady = true;

    reactionAppearedAt =
        performance.now();
}


function hitReactionTarget(event) {

    if (
        !reactionRunning ||
        !reactionReady
    ) {
        return;
    }

    event.stopPropagation();

    const time =
        performance.now() -
        reactionAppearedAt;

    reactionResultsArray.push(
        time
    );

    reactionRound += 1;

    reactionReady = false;

    reactionTarget.classList.add("hidden");

    reactionMessage.textContent =
        `${Math.round(time)} ms`;

    setTimeout(
        startReactionRound,
        850
    );
}


function reactionFalseStart() {

    if (
        !reactionRunning ||
        reactionReady
    ) {
        return;
    }

    clearTimeout(
        reactionTimeout
    );

    falseStarts += 1;

    reactionMessage.textContent =
        "Muy pronto";

    setTimeout(
        startReactionRound,
        900
    );
}


function finishReactionGame() {

    reactionRunning = false;
    reactionReady = false;

    reactionArea.classList.add("hidden");
    reactionTarget.classList.add("hidden");

    const average =
        reactionResultsArray.reduce(
            (sum, value) =>
                sum + value,
            0
        ) /
        reactionResultsArray.length;

    const best =
        Math.min(
            ...reactionResultsArray
        );

    const worst =
        Math.max(
            ...reactionResultsArray
        );

    reactionAverage.textContent =
        `${Math.round(average)} ms`;

    reactionBest.textContent =
        `${Math.round(best)} ms`;

    reactionWorst.textContent =
        `${Math.round(worst)} ms`;

    reactionResultRounds.textContent =
        reactionResultsArray.length;

    reactionFalseStarts.textContent =
        falseStarts;

    updateReactionRecord(
        best
    );

    reactionResults.classList.remove("hidden");
}


function updateReactionRecord(best) {

    const stored =
        Number(
            localStorage.getItem(
                "aimzip-reaction-best"
            )
        );

    if (
        !stored ||
        best < stored
    ) {

        localStorage.setItem(
            "aimzip-reaction-best",
            String(best)
        );

        reactionRecord.textContent =
            `${Math.round(best)} ms`;

        return;
    }

    reactionRecord.textContent =
        `${Math.round(stored)} ms`;
}


function loadReactionRecord() {

    const stored =
        localStorage.getItem(
            "aimzip-reaction-best"
        );

    if (stored) {

        reactionRecord.textContent =
            `${Math.round(
                Number(stored)
            )} ms`;

    }
}


/* ========================================
   EVENTOS
   ======================================== */

flickStartButton.addEventListener(
    "click",
    startFlickGame
);

flickRestartButton.addEventListener(
    "click",
    startFlickGame
);

target.addEventListener(
    "pointerdown",
    hitTarget
);

arena.addEventListener(
    "pointerdown",
    event => {

        registerMiss(event);

    }
);


reactionStartButton.addEventListener(
    "click",
    startReactionGame
);

reactionRestartButton.addEventListener(
    "click",
    startReactionGame
);

reactionTarget.addEventListener(
    "pointerdown",
    hitReactionTarget
);

reactionArea.addEventListener(
    "pointerdown",
    event => {

        if (
            event.target !==
            reactionTarget
        ) {

            reactionFalseStart();

        }

    }
);


/* ========================================
   INICIO
   ======================================== */

loadFlickPersonalBest();
loadReactionRecord();

showModeScreen();
