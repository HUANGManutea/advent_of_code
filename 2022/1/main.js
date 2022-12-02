const fs = require('fs');
const readline = require('readline');


async function puzzle1() {
    const fileStream = fs.createReadStream('input1.txt');
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    const elves = [];
    let currentElf = 0;
    for await (const line of rl) {
      if (line.match(/^\s*$/)) {
        // empty line
        elves.push(currentElf);
        currentElf = 0;
      } else {
        const foodCal = parseInt(line);
        currentElf += foodCal;
      }
    }

    const maxCalElf = Math.max(...elves);
    console.log(maxCalElf);
}
// puzzle1();

async function puzzle2() {
    const fileStream = fs.createReadStream('input1.txt');
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let elves = [];
    let currentElf = 0;
    for await (const line of rl) {
      if (line.match(/^\s*$/)) {
        // empty line
        elves.push(currentElf);
        currentElf = 0;
      } else {
        const foodCal = parseInt(line);
        currentElf += foodCal;
      }
    }

    let totalCalTop3 = 0;

    for (let index = 0; index < 3; index++) {
        const maxCalElf = Math.max(...elves);
        totalCalTop3 += maxCalElf;
        const elfMaxCalIndex = elves.findIndex(cal => cal === maxCalElf);
        elves.splice(elfMaxCalIndex, 1);
    }
    console.log(totalCalTop3);
}

puzzle2();