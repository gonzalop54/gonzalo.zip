"use strict";

const experimentList =
    document.querySelector("#experiment-list");

const experimentCount =
    document.querySelector("#experiment-count");


async function loadExperiments() {
    try {
        const response =
            await fetch("data/experiments.json");

        if (!response.ok) {
            throw new Error(
                `Error HTTP: ${response.status}`
            );
        }

        const experiments =
            await response.json();

        renderExperiments(experiments);

    } catch (error) {
        console.error(
            "No se pudieron cargar los experimentos:",
            error
        );

        experimentCount.textContent =
            "error al cargar";

        experimentList.innerHTML = `
            <div class="loading-error">
                No pude cargar los experimentos.
            </div>
        `;
    }
}


function renderExperiments(experiments) {
    experimentList.innerHTML = "";

    const availableExperiments =
        experiments.filter(
            experiment =>
                experiment.status === "available"
        );

    experimentCount.textContent =
        `${availableExperiments.length} ${
            availableExperiments.length === 1
                ? "disponible"
                : "disponibles"
        }`;


    experiments.forEach(experiment => {

        const card =
            document.createElement("a");

        card.className =
            "experiment-card";

        card.href =
            experiment.url;

        card.innerHTML = `
            <div class="experiment-number">
                #${String(experiment.id).padStart(3, "0")}
            </div>

            <div class="experiment-content">
                <h3>${escapeHTML(experiment.title)}</h3>

                <p>
                    ${escapeHTML(
                        experiment.description
                    )}
                </p>
            </div>

            <div class="experiment-arrow">
                →
            </div>
        `;

        experimentList.appendChild(card);
    });
}


function escapeHTML(text) {
    const element =
        document.createElement("div");

    element.textContent = text;

    return element.innerHTML;
}


loadExperiments();
