const fs = require('fs');

function findMarkerPosition(signalArray, nbDiffChars) {
    let markerPosition = -1;
    for (let index = 0; markerPosition < 0 && index < signalArray.length - nbDiffChars; index++) {
        const window = signalArray.slice(index, index + nbDiffChars);
        const allDifferent = new Set(window).size === nbDiffChars;
        if (allDifferent) {
            markerPosition = index + nbDiffChars;
        }
    }
    return markerPosition;
}

function puzzle1() {
    const signalArray = fs.readFileSync('input1.txt', 'utf-8').split(/\r?\n/)[0].split("");
    const markerPosition = findMarkerPosition(signalArray, 4);
    const nbCharProcessed = markerPosition;
    console.log(nbCharProcessed);
}

function puzzle2() {
    const signalArray = fs.readFileSync('input1.txt', 'utf-8').split(/\r?\n/)[0].split("");
    const markerPosition = findMarkerPosition(signalArray, 14);
    const nbCharProcessed = markerPosition;
    console.log(nbCharProcessed);
}

// puzzle1();
puzzle2();