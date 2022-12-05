const fs = require('fs');

function parseStartingState(startingState) {
    const lines = startingState.split(/\r?\n/);
    const state = {};
    lines.forEach(line => {
        for (let index = 0; index < line.length; index+=4) {
            // index is 0, 4, 8, 12, ...
            // to facilitate comprehension, we will store index as 1, 2, 3, 4...
            const stateIndex = index / 4 + 1;
            // we will be using slice, for the endIndex limit to the size of the array
            const endSlice = (index + 4 > line.length) ? line.length : index + 4;
            const column = line.slice(index, endSlice);
            // match "[<number>]" ?
            const match = column.match(/\[(.*)\].*/)
            if (match) {
                // lazy init array
                if (state[stateIndex] == null) {
                    state[stateIndex] = [];
                }
                // careful on the order, we want to use the pop() function that takes the first element of an array
                state[stateIndex] = [match[1], ...state[stateIndex]];
            }
        }
    });
    return state;
}

function parseInstructions(instructionList) {
    const lines = instructionList.split(/\r?\n/);
    const instructions = [];
    lines.forEach(line => {
        // map to object to facilitate manipulation
        const match = line.match(/move (\d+) from (\d+) to (\d+)/);
        if (match) {
            instructions.push({
                quantity: match[1],
                startStack: match[2],
                endStack: match[3]
            });
        }
    })
    return instructions;
}

function rearrange(state, instructions) {
    // deep copy to avoid modifying the initial object
    const newState = JSON.parse(JSON.stringify(state));
    instructions.forEach(instruction => {
        for (let index = 0; index < instruction.quantity; index++) {
            // pop from one index, push into another
            const crate = newState[instruction.startStack].pop();
            newState[instruction.endStack].push(crate);
        }
    })
    return newState;
}

function rearrangeSplice(state, instructions) {
    // deep copy
    const newState = JSON.parse(JSON.stringify(state));
    instructions.forEach(instruction => {
        // splice keeps the order, the starting index is size - number of stacks we want to move
        const splicedStacks = newState[instruction.startStack].splice(newState[instruction.startStack].length - instruction.quantity);
        // careful on the order
        newState[instruction.endStack] = [...newState[instruction.endStack], ...splicedStacks];
    })
    return newState;
}

// transform {1: ["A", "B"], 2: ["C", "D"]} into "BD"
function printResult(state) {
    return Object.values(state) // get the arrays
        .map(stack => stack.slice(-1)) // take the last
        .join('');
}

function puzzle1() {
    const [startingState, instructionList] = fs.readFileSync('input1.txt', 'utf-8').split(/\r?\n\r?\n/);
    const state = parseStartingState(startingState);
    const instructions = parseInstructions(instructionList);
    const newState = rearrange(state, instructions);
    const result = printResult(newState);
    console.log(result);
}

function puzzle2() {
    const [startingState, instructionList] = fs.readFileSync('input1.txt', 'utf-8').split(/\r?\n\r?\n/);
    const state = parseStartingState(startingState);
    const instructions = parseInstructions(instructionList);
    const newState = rearrangeSplice(state, instructions);
    const result = printResult(newState);
    console.log(result);
}

// puzzle1();
puzzle2();