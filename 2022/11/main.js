const fs = require('fs');

class Monkey {
    constructor() {
        this.name = "-1";
        this.nbItemsInspected = 0;
        this.items = [];
        this.changeWorrylevel = () => {};
        this.testAlgorithm = () => {};
        this.testFunction = () => {};
    }

    setName(line) {
        const matches = line.match(/Monkey (\d+)/);
        if (matches) {
            this.name = matches[1];
        }
    }

    setItems(line) {
        const matches = line.match(/Starting items: (.*)/);
        if (matches) {
            this.items = matches[1].split(", ").map(worryLevel => new Item(parseInt(worryLevel)));
        }
    }

    incrementNbItemsInspected() {
        this.nbItemsInspected++;
    }

    applyBored(index) {
        const item = this.items[index];
        item.worryLevel = Math.floor(item.worryLevel / 3);
        // console.log(`after bored, worry level: ${item.worryLevel}`)
    }

    applyBoredPuzzle2() {
    }

    setChangeWorryLevel(line) {
        let operation = (index) => {};
        const matches = line.match(/Operation: new = old (.) (.*)/);
        if (matches) {
            const op = matches[1];
            const arg = matches[2];
            if (op === '+') {
                if (arg === "old") {
                    operation = index => this.items[index].worryLevel += this.items[index].worryLevel;
                } else {
                    operation = index => this.items[index].worryLevel += parseInt(arg);
                }
            } else if (op === '-') {
                if (arg === "old") {
                    operation = index => 0;
                } else {
                    operation = index => this.items[index].worryLevel -= parseInt(arg);
                }
            } else if (op === '*') {
                if (arg === "old") {
                    operation = index => this.items[index].worryLevel *= this.items[index].worryLevel;
                } else {
                    operation = index => this.items[index].worryLevel *= parseInt(arg);
                }
            } else if (op === '/') {
                if (arg === "old") {
                    operation = index => 1;
                } else {
                    operation = index => this.items[index].worryLevel = Math.floor(this.items[index].worryLevel / parseInt(arg));
                }
            }
        }
        this.changeWorrylevel = operation;
    }

    setTestAlgorithm(lines) {
        const matchesDivisible = lines[0].match(/Test: divisible by (\d+)/);
        if (matchesDivisible) {
            this.testFunction = x => x % parseInt(matchesDivisible[1]) === 0;
        }
        let testTrueMonkey = 1;
        const matchesTrueCondition = lines[1].match(/If true: throw to monkey (\d+)/);
        if (matchesTrueCondition) {
            testTrueMonkey = matchesTrueCondition[1];
        }
        let testFalseMonkey = 2;
        const matchesFalseCondition = lines[2].match(/If false: throw to monkey (\d+)/);
        if (matchesFalseCondition) {
            testFalseMonkey = matchesFalseCondition[1];
        }

        this.testAlgorithm = (index) => {
            let nextMonkey = 1;
            const item = this.items[index];
            if (this.testFunction(item.worryLevel)) {
                nextMonkey = testTrueMonkey;
            } else {
                nextMonkey = testFalseMonkey;
            }
            item.nextMonkey = nextMonkey;
        }
    }

    throwItemsToNextMonkeys(monkeys) {
        const itemsToThrow = this.items.filter(i => i.nextMonkey >= 0);
        itemsToThrow.forEach(item => {
            const copyItem = JSON.parse(JSON.stringify(item));
            copyItem.nextMonkey = -1;
            monkeys[item.nextMonkey].items = [...monkeys[item.nextMonkey].items, copyItem];
        });
        this.items = this.items.filter(i => i.nextMonkey < 0);
    }

    toString() {
        return `
        name: ${this.name},
        items: ${JSON.stringify(this.items)},
        changeWorrylevel: ${this.changeWorrylevel},
        testFunction: ${this.testFunction},
        testAlgorithm: ${this.testAlgorithm}
        `;
    }
}

class Item {
    constructor(worryLevel) {
        this.worryLevel = worryLevel;
        this.nextMonkey = -1;
    }

    setWorrylevel(newLevel) {
        // console.log(`new worry level: ${newLevel}`);
        this.worryLevel = newLevel;
    }

    setNextMonkey(nextMonkey) {
        this.nextMonkey = nextMonkey;
    }
}

function getMonkeyBusiness(monkeys) {
    const sortedByNbItemsInspected = monkeys.sort((m1, m2) => m1.nbItemsInspected - m2.nbItemsInspected).reverse();
    return sortedByNbItemsInspected.slice(0,2).reduce((business, monkey) => business *= monkey.nbItemsInspected, 1);
}

function puzzle1() {
    const monkeys = [];
    const lineGroups = fs.readFileSync('input1.ex.txt', 'utf-8').split(/\r?\n\r?\n/);
    lineGroups.forEach(lineGroup => {
        const monkey = new Monkey();
        const monkeylines = lineGroup.split(/\r?\n/);
        monkey.setName(monkeylines[0]);
        monkey.setItems(monkeylines[1]);
        monkey.setChangeWorryLevel(monkeylines[2]);
        monkey.setTestAlgorithm(monkeylines.slice(3));
        monkeys.push(monkey);
    });
    console.log("initial monkeys items");
    monkeys.forEach(m => console.log(JSON.stringify(m.items)));
    const rounds = 20;
    for (let round = 0; round < rounds; round++) {
        monkeys.forEach(monkey => {
            const copyItems = JSON.parse(JSON.stringify(monkey.items));
            for (let index = 0; index < copyItems.length; index++) {
                const item = copyItems[index];
                monkey.incrementNbItemsInspected();
                // console.log(`monkey ${monkey.name} inpected ${monkey.nbItemsInspected} times`);
                monkey.changeWorrylevel(index);
                monkey.applyBored(index);
                monkey.testAlgorithm(index);
            }
            monkey.throwItemsToNextMonkeys(monkeys);
            // monkeys.forEach(m => console.log(JSON.stringify(m.items)));
        });
    }
    console.log("final monkeys items");
    monkeys.forEach(m => console.log(JSON.stringify(m.items)));
    const monkeyBusiness = getMonkeyBusiness(monkeys);
    console.log(`monkeyBusiness: ${monkeyBusiness}`);
}

function puzzle2() {
    const monkeys = [];
    const lineGroups = fs.readFileSync('input1.ex.txt', 'utf-8').split(/\r?\n\r?\n/);
    lineGroups.forEach(lineGroup => {
        const monkey = new Monkey();
        const monkeylines = lineGroup.split(/\r?\n/);
        monkey.setName(monkeylines[0]);
        monkey.setItems(monkeylines[1]);
        monkey.setChangeWorryLevel(monkeylines[2]);
        monkey.setTestAlgorithm(monkeylines.slice(3));
        monkeys.push(monkey);
    });
    console.log("initial monkeys items");
    monkeys.forEach(m => console.log(JSON.stringify(m.items)));
    const rounds = 20;
    for (let round = 0; round < rounds; round++) {
        monkeys.forEach(monkey => {
            const copyItems = JSON.parse(JSON.stringify(monkey.items));
            for (let index = 0; index < copyItems.length; index++) {
                const item = copyItems[index];
                monkey.incrementNbItemsInspected();
                console.log(`monkey ${monkey.name} inpected ${monkey.nbItemsInspected} times`);
                monkey.changeWorrylevel(index);
                monkey.applyBoredPuzzle2();
                monkey.testAlgorithm(index);
            }
            monkey.throwItemsToNextMonkeys(monkeys);
            // monkeys.forEach(m => console.log(JSON.stringify(m.items)));
        });
    }
    console.log("final monkeys items");
    monkeys.forEach(m => console.log(JSON.stringify(m.items)));
    const monkeyBusiness = getMonkeyBusiness(monkeys);
    console.log(`monkeyBusiness: ${monkeyBusiness}`);
}

puzzle1();
// puzzle2();