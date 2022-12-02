const fs = require('fs');

// indexP2 - indexP1 % 3
// 0 - 2 % 3 = 1 => win
// 0 - 1 % 3 = 2 => lose
// 0 - 0 % 3 = 0 => draw
// 2 - 1 % 3 = 1 => win
// 2 - 0 % 3 = 2 => lose
// 2 - 2 % 3 = 0 => draw
// 1 - 0 % 3 = 1 => win
// 1 - 2 % 3 = 2 => lose
// 1 - 1 % 3 = 0 => draw
const moves = ["rock", "paper", "scissors"];


function mod(n, m) {
    return ((n % m) + m) % m;
}

function moveScoreValue(moveP2) {
    return moves.indexOf(moveP2) + 1;
}

function puzzle1() {
    const moveTranslation = {
        "A" : "rock",
        "B" : "paper",
        "C" : "scissors",
        "X" : "rock",
        "Y" : "paper",
        "Z" : "scissors",
    };
    const resultScore = (moveP1, moveP2) => {
        const indexM1 = moves.indexOf(moveP1);
        const indexM2 = moves.indexOf(moveP2);
        const result = mod(indexM2 - indexM1, 3);
        if (result === 1) {
            return 6; // win
        } else if (result === 2) {
            return 0; // lose
        }
        return 3; // draw
    }
    const lines = fs.readFileSync('input1.txt', 'utf-8').split(/\r?\n/);
    let scorePlayer2 = 0;
    lines.forEach(line => {
        if (!line.match(/^\s*$/)) {
            const [moveP1, moveP2] = line.split(" ").map(move => moveTranslation[move]);
            const moveScore =  moveScoreValue(moveP2);
            const roundScore = resultScore(moveP1, moveP2);
            scorePlayer2 += moveScore + roundScore;
        }
    });
    console.log(scorePlayer2);
}

function puzzle2() {
    const moveTranslationP1 = {
        "A" : "rock",
        "B" : "paper",
        "C" : "scissors",
    };

    const moveTranslationP2 = (rawResultP2, moveP1) => {
        if (rawResultP2 === "X") {
            // losing move
            return moves[(moves.indexOf(moveP1) + 2) % 3];
        } else if (rawResultP2 === "Y") {
            // draw move
            return moveP1;
        }
        // winning move
        return moves[(moves.indexOf(moveP1) + 1) % 3];
    };

    const resultScore = (rawResultP2) => {
        if (rawResultP2 === "X") {
            return 0;
        } else if (rawResultP2 === "Y") {
            return 3;
        }
        return 6;
    };

    const lines = fs.readFileSync('input1.txt', 'utf-8').split(/\r?\n/);
    let scorePlayer2 = 0;
    lines.forEach(line => {
        if (!line.match(/^\s*$/)) {
            const [rawMoveP1, rawResultP2] = line.split(" ");
            const moveP1 = moveTranslationP1[rawMoveP1];
            const moveP2 = moveTranslationP2(rawResultP2, moveP1);
            const moveScore =  moveScoreValue(moveP2);
            const roundScore = resultScore(rawResultP2);
            scorePlayer2 += moveScore + roundScore;
        }
    });
    console.log(scorePlayer2);
}

// puzzle1();
puzzle2();