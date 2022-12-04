
const fs = require('fs');

// return true if assignmentA is totally inside assignment B
function isOverlap(assignmentA, assignmentB) {
    return assignmentA[0] >= assignmentB[0] && assignmentA[1] <= assignmentB[1]
}

// return true if assignmentA is partially inside assignment B
function isPartialOverlap(assignmentA, assignmentB) {
    return (assignmentA[0] >= assignmentB[0] && assignmentA[0] <= assignmentB[1]) || (assignmentA[1] >= assignmentB[0] && assignmentA[1] <= assignmentB[1])
}

function puzzle1() {
    const elfPairsString = fs.readFileSync('input1.txt', 'utf-8').split(/\r?\n/);
    const sumAssignmentsOverlap = elfPairsString.filter(elfPair => !elfPair.match(/^\s*$/)) // filter empty line
        .map(elfPair => elfPair.split(",").map(range => range.split("-").map(Number))) // transform "48-86,6-85" into [[48, 86],[6, 85]] with Number cast
        .filter(([elf1Assignment, elf2Assignment]) => (isOverlap(elf1Assignment, elf2Assignment) || isOverlap(elf2Assignment, elf1Assignment))) // keep only the overlap pairs
        .length
    console.log(sumAssignmentsOverlap);
}

function puzzle2() {
    const elfPairsString = fs.readFileSync('input1.txt', 'utf-8').split(/\r?\n/);
    const sumAssignmentsPartialOverlap = elfPairsString.filter(elfPair => !elfPair.match(/^\s*$/)) // filter empty line
        .map(elfPair => elfPair.split(",").map(range => range.split("-").map(Number))) // transform "48-86,6-85" into [[48, 86],[6, 85]] with Number cast
        .filter(([elf1Assignment, elf2Assignment]) => (isPartialOverlap(elf1Assignment, elf2Assignment) || isPartialOverlap(elf2Assignment, elf1Assignment))) // keep only the partial overlap pairs
        .length
    console.log(sumAssignmentsPartialOverlap);
}

// puzzle1();
puzzle2();