"use strict";

const arena =
    document.querySelector("#arena");

const target =
    document.querySelector("#target");

const startScreen =
    document.querySelector("#start-screen");

const countdown =
    document.querySelector("#countdown");

const results =
    document.querySelector("#results");

const startButton =
    document.querySelector("#start-button");

const restartButton =
    document.querySelector("#restart-button");

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


let running = false;

let hits = 0;
let misses = 0;

let totalTargets = 20;

let gameStartedAt = 0;
let targetSpawnedAt = 0;

let reactionTimes = [];

let animationFrame = null;


function sleep(milliseconds) {
    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );
}


async function startGame() {
    running = false;

    startScreen.classList.add(
        "hidden"
    );

    results.classList.add(
        "hidden"
    );

    target.classList.add(
        "hidden"
    );

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

    resetStats();

    countdown.classList.remove(
        "hidden"
    );

    for (
        const number of [3, 2, 1]
    ) {
        countdown.textContent =
            number;

        await sleep(650);
    }

    countdown.textContent =
        "GO";

    await sleep(350);

    countdown.classList.add(
        "hidden"
    );

    running = true;

    gameStartedAt =
        performance.now();

    spawnTarget();

    animationFrame =
        requestAnimationFrame(
            updateTimer
        );
}


function spawnTarget() {
    if (
        hits >= totalTargets
    ) {
        finishGame();
        return;
    }

    const arenaRect =
        arena.getBoundingClientRect();

    const targetRect =
        target.getBoundingClientRect();

    const radius =
        Math.max(
            targetRect.width,
            targetRect.height
        ) / 2;

    const padding =
        radius + 15;

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

    target.style.left =
        `${x}px`;

    target.style.top =
        `${y}px`;

    target.classList.remove(
        "hidden"
    );

    targetSpawnedAt =
        performance.now();
}


function hitTarget(event) {
    if (!running) {
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

    updateStats();

    target.classList.add(
        "hidden"
    );

    spawnTarget();
}


function registerMiss(event) {
    if (!running) {
        return;
    }

    if (
        event.target === target
    ) {
        return;
    }

    misses += 1;

    missesElement.textContent =
        misses;

    updateStats();
}


function calculateAccuracy() {
    const totalShots =
        hits + misses;

    if (
        totalShots === 0
    ) {
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


function updateStats() {
    const accuracy =
        calculateAccuracy();

    accuracyElement.textContent =
        `${accuracy.toFixed(1)}%`;

    scoreElement.textContent =
        calculateScore();
}


function updateTimer() {
    if (!running) {
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


function finishGame() {
    running = false;

    target.classList.add(
        "hidden"
    );

    if (
        animationFrame !== null
    ) {
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

    updatePersonalBest(
        finalScore
    );

    results.classList.remove(
        "hidden"
    );
}


function updatePersonalBest(score) {
    const stored =
        Number(
            localStorage.getItem(
                "aimzip-best-score"
            )
        );

    if (
        !stored ||
        score > stored
    ) {
        localStorage.setItem(
            "aimzip-best-score",
            String(score)
        );

        personalBest.textContent =
            score;

        return;
    }

    personalBest.textContent =
        stored;
}


function loadPersonalBest() {
    const stored =
        localStorage.getItem(
            "aimzip-best-score"
        );

    if (stored) {
        personalBest.textContent =
            stored;
    }
}


function resetStats() {
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


startButton.addEventListener(
    "click",
    startGame
);

restartButton.addEventListener(
    "click",
    startGame
);

target.addEventListener(
    "pointerdown",
    hitTarget
);

arena.addEventListener(
    "pointerdown",
    registerMiss
);

loadPersonalBest();
