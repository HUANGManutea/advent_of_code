const fs = require('fs');

// ["a", "b", ..., "z"]
const lowercases = Array.from(Array(26)).map((e, i) => i + 97).map((x) => String.fromCharCode(x));
// ["A", "B", ..., "Z"]
const uppercases = Array.from(Array(26)).map((e, i) => i + 65).map((x) => String.fromCharCode(x));

function itemToPriority(item) {
    if (lowercases.indexOf(item) > 0) {
        return lowercases.indexOf(item) + 1;
    }
    if (uppercases.indexOf(item) > 0) {
        return uppercases.indexOf(item) + 27;
    }
}

function puzzle1() {
    const rucksacks = fs.readFileSync('input1.txt', 'utf-8').split(/\r?\n/);
    let sumPriority = 0;
    rucksacks.forEach(rucksack => {
        const contentCompart1 = new Set([...rucksack.substring(0, rucksack.length / 2)]);
        const contentCompart2 = new Set([...rucksack.substring(rucksack.length / 2)]);

        contentCompart1.forEach(item => {
            if (contentCompart2.has(item)) {
                const doublon = item;
                const doublonPriority = itemToPriority(doublon);
                sumPriority += doublonPriority;
            }
        })
        
    })
    console.log(sumPriority);
}

function puzzle2() {
    const rucksacks = fs.readFileSync('input1.txt', 'utf-8').split(/\r?\n/);
    let sumPriority = 0;
    for (let teamIndex = 0; teamIndex < rucksacks.length; teamIndex+=3) {
        const contentElf1 = new Set([...rucksacks[teamIndex]]);
        const contentElf2 = new Set([...rucksacks[teamIndex+1]]);
        const contentElf3 = new Set([...rucksacks[teamIndex+2]]);

        contentElf1.forEach(item => {
            if (contentElf2.has(item) && contentElf3.has(item)) {
                const doublon = item;
                const doublonPriority = itemToPriority(doublon);
                sumPriority += doublonPriority;
            }
        })
    }
    console.log(sumPriority);
}

// puzzle1();
puzzle2();