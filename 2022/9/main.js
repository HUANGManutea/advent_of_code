const fs = require('fs');

function isHeadMoveNextToTail(nextPosHead, currentPosTail) {
    // case diagonal
    if (Math.abs(nextPosHead.row - currentPosTail.row) === 1 && Math.abs(nextPosHead.col - currentPosTail.col) === 1) {
        return true;
    } else if (Math.abs(nextPosHead.row - currentPosTail.row) + Math.abs(nextPosHead.col - currentPosTail.col) <= 1) {
        return true;
    }
    return false;
}

function isHeadMoveSameAsTail(nextPosHead, currentPosTail) {
    return nextPosHead.col === currentPosTail.col && nextPosHead.row === currentPosTail.row;
}

function moveTo(currentPosHead, currentPosTail, nextPosHead, grid, markGrid) {
    
    // place head at next head position
    grid[nextPosHead.row][nextPosHead.col] = 'H';
    grid[currentPosHead.row][currentPosHead.col] = '.';
    if (currentPosTail.row === -1 && currentPosTail === -1) {
        // tail not in grid
        // place tail at current head position
        markGrid[currentPosHead.row][currentPosHead.col] = '#';
        grid[currentPosHead.row][currentPosHead.col] = 'T';
        return [nextPosHead, currentPosHead];
    } else {
        if (!isHeadMoveSameAsTail(nextPosHead, currentPosTail) && !isHeadMoveNextToTail(nextPosHead, currentPosTail)) {
            // move tail only if it's not a cover and not a move next to tail 
            markGrid[currentPosHead.row][currentPosHead.col] = '#';
            // place tail at current head position 
            grid[currentPosHead.row][currentPosHead.col] = 'T';
            // update the tail position
            return [nextPosHead, currentPosHead];
        }
        return [nextPosHead, currentPosTail];
    }
}

function moveToNKnot(isRealTail, currentPosHead, currentPosTail, nextPosHead, headValue, tailValue, grid, markGrid) {
    
    // place head at next head position
    grid[nextPosHead.row][nextPosHead.col] = headValue;
    grid[currentPosHead.row][currentPosHead.col] = '.';
    // TODO way outside grid
    if (currentPosTail.row === -1 && currentPosTail.col === -1) {
        // tail not in grid
        // place tail at current head position
        grid[currentPosHead.row][currentPosHead.col] = tailValue;
        if (isRealTail) {
            markGrid[currentPosHead.row][currentPosHead.col] = '#';
        }
        return [nextPosHead, currentPosHead];
    } else {
        if (!isHeadMoveSameAsTail(nextPosHead, currentPosTail) && !isHeadMoveNextToTail(nextPosHead, currentPosTail)) {
            // move tail only if it's not a cover and not a move next to tail 
            
            // place tail at current head position 
            grid[currentPosHead.row][currentPosHead.col] = tailValue;
            if (isRealTail) {
                markGrid[currentPosHead.row][currentPosHead.col] = '#';
            }
            // update the tail position
            return [nextPosHead, currentPosHead];
        }
        return [nextPosHead, currentPosTail];
    }
}

function computeGridSize(lines) {
    const counts = new Map();
    let currentRow = 0;
    let currentCol = 0;
    let maxRow = 0;
    let minRow = -1;
    let maxCol = 0;
    let minCol = -1;
    lines.forEach(line => {
        const [direction, times] = line.split(" ");
        if (direction === "U") {
            currentRow += parseInt(times);
            maxRow = Math.max(currentRow, maxRow);
        } else if (direction === "D") {
            currentRow -= parseInt(times);
            minRow = Math.min(currentRow, minRow);
        } else if (direction === "L") {
            currentCol -= parseInt(times);
            minCol = Math.min(currentCol, minCol);
        } else {
            currentCol += parseInt(times);
            maxCol = Math.max(currentCol, maxCol);
        }
    });
    // double the size so that we can always be inside the map
    const maxSize = (Math.max(maxRow, maxCol, -minRow, -minCol) + 1) * 2;
    return maxSize;
}

function getNextHeadPosition(currentPosHead, direction) {
    if (direction === 'U') {
        return {
            row: currentPosHead.row + 1,
            col: currentPosHead.col
        }
    } else if (direction === 'D') {
        return {
            row: currentPosHead.row - 1,
            col: currentPosHead.col
        }
    } else if (direction === 'L') {
        return {
            row: currentPosHead.row,
            col: currentPosHead.col - 1
        }
    } else {
        // R
        return {
            row: currentPosHead.row,
            col: currentPosHead.col + 1
        }
    }
}

function countPlacesTailVisited(markGrid) {
    let count = 0;
    for (let row = 0; row < markGrid.length; row++) {
        for (let col = 0; col < markGrid[0].length; col++) {
            if (markGrid[row][col] === '#') {
                count++;
            }
        }
    }
    return count;
}

function gridToString(grid) {
    let result = "\n";
    for (let row = 0; row < grid.length; row++) {
        let rowString = "";
        for (let col = 0; col < grid[0].length; col++) {
            rowString += grid[row][col];
        }
        result += rowString + "\n";
    }
    return result;
}

function getInitialState(maxSize) {
    let grid = [];
    let markGrid = [];
    for (let row = 0; row < maxSize; row++) {
        let row = [];
        let markRow = [];
        for (let col = 0; col < maxSize; col++) {
            row.push(".");
            markRow.push(".");
        }
        grid.push(row);
        markGrid.push(markRow);
    }
    let currentPosHead = {
        row: maxSize/2,
        col: maxSize/2
    }
    let currentPosTail = {
        row: -1,
        col: -1
    };
    grid[currentPosHead.row][currentPosHead.col] = 'H';
    return [grid, markGrid, currentPosHead, currentPosTail];
}

function puzzle1() {
    const lines = fs.readFileSync('input1.txt', 'utf-8').split(/\r?\n/).slice(0, -1);
    const maxSize = computeGridSize(lines);
    let [grid, markGrid, currentPosHead, currentPosTail] = getInitialState(maxSize);

    lines.forEach(line => {
        const [direction, times] = line.split(" ");
        for (let time = 0; time < times; time++) {
            const nextPosHead = getNextHeadPosition(currentPosHead, direction);
            const [newPosHead, newPosTail] = moveTo(currentPosHead, currentPosTail, nextPosHead, grid, markGrid);
            currentPosHead = newPosHead;
            currentPosTail = newPosTail;
        }
    });

    console.log(countPlacesTailVisited(markGrid));
}

function puzzle2() {
    const lines = fs.readFileSync('input1.txt', 'utf-8').split(/\r?\n/).slice(0, -1);
    const maxSize = computeGridSize(lines);
    let [grid, markGrid, currentPosHead, currentPosTail] = getInitialState(maxSize);
    let knots = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let currentPos = knots.map(_ => {
        return {
            row: -1,
            col: -1
        }
    });
    currentPos = [currentPosHead, ...currentPos];
    console.log(currentPos);
    knots = ['H', ...knots];
    console.log(knots);
    lines.forEach(line => {
        const [direction, times] = line.split(" ");
        for (let time = 0; time < times; time++) {
            const nextPosHead = getNextHeadPosition(currentPos[0], direction);
            for (let i = 0; i < currentPos.length - 1; i++) {
                if (isHeadInsideGrid(currentPos[i])) {
                    console.log(`headValue: ${knots[i]}, tailValue: ${knots[i+1]}`);
                    const [newPosHead, newPosTail] = moveToNKnot(i + 1 === currentPos.length - 1, currentPos[i], currentPos[i+1], nextPosHead, knots[i], knots[i+1], grid, markGrid);
                    currentPos[i] = newPosHead;
                    currentPos[i+1] = newPosTail;
                    console.log(currentPos);
                }
            }
        }
    });
    console.log(gridToString(grid));
    console.log(gridToString(markGrid));
    console.log(countPlacesTailVisited(markGrid));
}

// puzzle1();
puzzle2();