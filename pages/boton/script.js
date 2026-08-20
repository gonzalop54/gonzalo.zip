"use strict";

const button = document.querySelector("#escape-button");
const arena = document.querySelector("#arena");

const messageElement = document.querySelector("#message");
const attemptsElement = document.querySelector("#attempts");
const timeElement = document.querySelector("#time");
const recordElement = document.querySelector("#record");

const messages = [
    "casi",
    "jajaj",
    "no",
    "dejame en paz",
    "¿seguís intentando?",
    "flaco",
    "esto ya es personal",
    "rendite",
    "no va a pasar",
    "bueno, capaz sí"
];

let attempts = 0;
let startTime = performance.now();
let finished = false;

const savedRecord = localStorage.getItem("button-record");

if (savedRecord !== null) {
    recordElement.textContent = `${Number(savedRecord).toFixed(1)}s`;
}

function moveButton() {
    if (finished) {
        return;
    }

    attempts += 1;
    attemptsElement.textContent = attempts;

    const messageIndex = Math.min(
        attempts - 1,
        messages.length - 1
    );

    messageElement.textContent = messages[messageIndex];

    const arenaRect = arena.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    const padding = 20;

    const maxX =
        arenaRect.width -
        buttonRect.width -
        padding * 2;

    const maxY =
        arenaRect.height -
        buttonRect.height -
        padding * 2;

    const randomX =
        padding + Math.random() * Math.max(maxX, 0);

    const randomY =
        padding + Math.random() * Math.max(maxY, 0);

    button.style.left = `${randomX}px`;
    button.style.top = `${randomY}px`;
    button.style.transform = "none";
}

function winGame() {
    if (finished) {
        return;
    }

    finished = true;

    const elapsed =
        (performance.now() - startTime) / 1000;

    messageElement.textContent = "¿CÓMO HICISTE?";

    button.textContent = "me atrapaste";
    button.disabled = true;

    const previousRecord =
        Number(localStorage.getItem("button-record"));

    if (
        !previousRecord ||
        elapsed < previousRecord
    ) {
        localStorage.setItem(
            "button-record",
            elapsed.toString()
        );

        recordElement.textContent =
            `${elapsed.toFixed(1)}s`;
    }
}

function updateTimer() {
    if (!finished) {
        const elapsed =
            (performance.now() - startTime) / 1000;

        timeElement.textContent =
            elapsed.toFixed(1);

        requestAnimationFrame(updateTimer);
    }
}

button.addEventListener("mouseenter", moveButton);
button.addEventListener("click", winGame);

button.addEventListener("touchstart", event => {
    event.preventDefault();
    moveButton();
});

requestAnimationFrame(updateTimer);
