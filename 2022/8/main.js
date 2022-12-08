const fs = require('fs');

//[size,S,N,W,E]
function markVisibilityByDirection(treeGrid) {
    const visibilityGrid = [];
    for (let row = 0; row < treeGrid.length; row++) {
        const visibilityRow = [];
        for (let col = 0; col < treeGrid[0].length; col++) {
            visibilityRow[col] = [treeGrid[row][col], "v","v","v","v"];
        }
        visibilityGrid[row] = visibilityRow;
    }

    // look from the north
    for (let row = 1; row < treeGrid.length - 1; row++) {
        for (let col = 1; col < treeGrid[0].length - 1; col++) {
            const treeSize = treeGrid[row][col];
            let rowBefore = row - 1;
            let isHidden = false;
            while(!isHidden && rowBefore >= 0) {
                if (treeGrid[rowBefore][col] >= treeSize) {
                    isHidden = true;
                }
                rowBefore--;
            }
            if (isHidden) {
                visibilityGrid[row][col][1] = "h";
            }
        }
    }
    // look from the south
    for (let row = treeGrid.length - 2; row >= 1; row--) {
        for (let col = 1; col < treeGrid[0].length - 1; col++) {
            const treeSize = treeGrid[row][col];
            let rowBefore = row + 1;
            let isHidden = false;
            while(!isHidden && rowBefore <= treeGrid.length - 1) {
                if (treeGrid[rowBefore][col] >= treeSize) {
                    isHidden = true;
                }
                rowBefore++;
            }
            if (isHidden) {
                visibilityGrid[row][col][2] = "h";
            }
        }
    }
    // look from the east
    for (let row = 1; row < treeGrid.length - 1; row++) {
        for (let col = treeGrid[0].length - 2; col >= 1; col--) {
            const treeSize = treeGrid[row][col];
            let colBefore = col - 1;
            let isHidden = false;
            while(!isHidden && colBefore >= 0) {
                if (treeGrid[row][colBefore] >= treeSize) {
                    isHidden = true;
                }
                colBefore--;
            }
            if (isHidden) {
                visibilityGrid[row][col][4] = "h";
            }
        }
    }
    // look from the west
    for (let row = 1; row < treeGrid.length - 1; row++) {
        for (let col = 1; col < treeGrid[0].length - 1; col++) {
            const treeSize = treeGrid[row][col];
            let colAfter = col + 1;
            let isHidden = false;
            while(!isHidden && colAfter <= treeGrid[0].length - 1) {
                if (treeGrid[row][colAfter] >= treeSize) {
                    isHidden = true;
                }
                colAfter++;
            }
            if (isHidden) {
                visibilityGrid[row][col][3] = "h";
            }
            
        }
    }

    return visibilityGrid;
}

function countVisible(visibilityGrid) {
    let count = 0;
    for (let row = 0; row < visibilityGrid.length; row++) {
        for (let col = 0; col < visibilityGrid[0].length; col++) {
            if (visibilityGrid[row][col].slice(1).some(visibility => visibility === "v")) {
                count++;
            }
        }
    }
    return count;
}

//[size,nbS,nbN,nbW,nbE,score]
function markOtherVisilityByDirection(treeGrid) {
    const otherVisilityGrid = [];
    for (let row = 0; row < treeGrid.length; row++) {
        const otherVisilityRow = [];
        for (let col = 0; col < treeGrid[0].length; col++) {
            const treeSize = treeGrid[row][col];
            const otherVisility = [treeSize, 0,0,0,0,0];
            // look from the north
            let rowAfter = row + 1;
            let stop = false;
            while(!stop && rowAfter <= treeGrid.length - 1) {
                if (treeGrid[rowAfter][col] >= treeSize) {
                    stop = true;
                }
                otherVisility[1]++;
                rowAfter++;
            }
            // look from the south
            let rowBefore = row - 1;
            stop = false;
            while(!stop && rowBefore >= 0) {
                if (treeGrid[rowBefore][col] >= treeSize) {
                    stop = true;
                }
                otherVisility[2]++;
                rowBefore--;
            }
            // look from the east
            let colBefore = col - 1;
            stop = false;
            while(!stop && colBefore >= 0) {
                if (treeGrid[row][colBefore] >= treeSize) {
                    stop = true;
                }
                otherVisility[3]++;
                colBefore--;
            }
            // look from the west
            let colAfter = col + 1;
            stop = false;
            while(!stop && colAfter <= treeGrid[0].length - 1) {
                if (treeGrid[row][colAfter] >= treeSize) {
                    stop = true;
                }
                otherVisility[4]++;
                colAfter++;
            }
            //compute scenic score
            otherVisility[5] = otherVisility.slice(1,-1).reduce((acc, value) => acc *= value, 1);
            otherVisilityRow[col] = otherVisility;
        }
        otherVisilityGrid[row] = otherVisilityRow;
    }

    return otherVisilityGrid;
}

function findHighestScenicScore(otherVisilityGrid) {
    let max = 0;
    for (let row = 0; row < otherVisilityGrid.length; row++) {
        for (let col = 0; col < otherVisilityGrid[0].length; col++) {
            if (otherVisilityGrid[row][col][5] > max) {
                max = otherVisilityGrid[row][col][5];
            }
        }
    }
    return max;
}

function puzzle1() {
    const treeGrid = fs.readFileSync('input1.txt', 'utf-8').split(/\r?\n/).slice(0, -1).map(str => str.split(""));
    const visibilityGrid = markVisibilityByDirection(treeGrid);
    const nbVisible = countVisible(visibilityGrid);
    console.log(nbVisible);
}

function puzzle2() {
    const treeGrid = fs.readFileSync('input1.txt', 'utf-8').split(/\r?\n/).slice(0, -1).map(str => str.split(""));
    const otherVisilityGrid = markOtherVisilityByDirection(treeGrid);
    const highestScenicScore = findHighestScenicScore(otherVisilityGrid);
    console.log(highestScenicScore);
}

// puzzle1();
puzzle2();