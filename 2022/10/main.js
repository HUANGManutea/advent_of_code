const fs = require('fs');

function newXWithMemory(X, memory) {
    if (memory != null) {
        return X + memory;
    }
    return X;
}
function compute(signals, lines) {
    let X = 1;
    let storedCommand = null;
    let signalValues = {};
    for (let index = 0; index < lines.length; index++) {
        // console.log(`index: ${index}, X: ${X}, line: ${lines[index]}, storedCommand: ${JSON.stringify(storedCommand)}`);
        const line = lines[index];
        // get signals
        if (signals.find(signal => signal === index)) {
            signalValues[index] = X;
        }
        const [command, arg] = line.split(" ");
        if (storedCommand != null && storedCommand.cycle === index) {
            X = newXWithMemory(X, storedCommand.value);
            // console.log(`index: ${index}, changed X: ${X}`);
            storedCommand = null;
        }
        if (command === "addx") {
            storedCommand = {
                cycle: index+1,
                value: parseInt(arg)
            }
            // console.log(`store new command : ${JSON.stringify(storedCommand)}`);
        } else {
            // noop
            storedCommand = null;
        }
    }
    return signalValues;
}

function computeWithSprite(lines, CRT) {
    let X = 1;
    let storedCommand = null;
    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        const [command, arg] = line.split(" ");
        if (storedCommand != null && storedCommand.cycle === index) {
            X = newXWithMemory(X, storedCommand.value);
            storedCommand = null;
        }
        drawCRT(index, X, CRT);
        if (command === "addx") {
            storedCommand = {
                cycle: index+1,
                value: parseInt(arg)
            }
        } else {
            // noop
            storedCommand = null;
        }
    }
}

function sumSignalValues(signals) {
    return Object.keys(signals).reduce((sum, signal) => sum + signals[signal] * signal, 0);
}

function addNoops(lines) {
    const newLines = [];
    lines.forEach(line => {
        if (line.match("noop")) {
            newLines.push(line);
        } else {
            newLines.push(line, "noop");
        }
    });
    return newLines;
}

function drawCRT(index, X, CRT) {
    let charToDraw = '.';
    const targetRowCRT = Math.floor(index/40) % 6;
    const targetColCRT = index % 40;
    if (targetColCRT >= X-1 && targetColCRT <= X+1) {
        charToDraw = "#";
    }
    CRT[targetRowCRT][targetColCRT] = charToDraw;
}

function CRTToString(CRT) {
    let result = "";
    for (let row = 0; row < 6; row++) {
        result += CRT[row].join('') + "\n";
    }
    return result;
}

function puzzle1() {
    let lines = fs.readFileSync('input1.txt', 'utf-8').split(/\r?\n/).slice(0, -1);
    lines = ["noop", ...lines];
    newLines = addNoops(lines);
    const signals = [20,60,100,140,180,220];
    const signalValues = compute(signals, newLines);
    const sum = sumSignalValues(signalValues);
    console.log(sum);
}

function puzzle2() {
    let lines = fs.readFileSync('input1.txt', 'utf-8').split(/\r?\n/).slice(0, -1);
    lines = ["noop", ...lines];
    newLines = addNoops(lines);
    const CRT = [];
    for (let row = 0; row < 6; row++) {
        const pixelRow = [];
        for (let col = 0; col < 40; col++) {
            pixelRow.push('.');
        }
        CRT.push(pixelRow);
    }
    console.log(CRTToString(CRT));
    computeWithSprite(newLines, CRT);
    console.log(CRTToString(CRT));
}

// puzzle1();
puzzle2();