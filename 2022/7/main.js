const fs = require('fs');


class File {
    constructor(name, size, parent) {
        this.type = "file";
        this.name = name;
        this.size = parseInt(size);
        this.parent = parent;
    }

    getSize() {
        return this.size;
    }

    goToParent() {
        return this.parent;
    }

    goToRoot() {
        const currentFile = this;
        while (currentFile.parent) {
            currentFile = currentFile.parent;
        }
        return currentFile;
    }

    print() {
        return `{"type": "${this.type}", "name": "${this.name}", "size": ${this.size}}`;
    }

    prettyPrint() {
        return JSON.stringify(JSON.parse(this.print()), null, 2);
    }
}

class Directory extends File {
    constructor(name, parent) {
        super(name, 0, parent);
        this.type = "directory";
        this.name = name;
        this.children = [];
    }

    addFile(file) {
        this.children.push(file);
        this.size += file.size;
        let parent = this.parent;
        while (parent) {
            parent.size += file.size;
            parent = parent.parent;
        }
    }

    hasFile(filename) {
        return this.children.find(child => child.name === filename);
    }

    cdFile(filename) {
        return this.children.find(child => child.name === filename);
    }

    print() {
        return `{"type": "${this.type}", "name": "${this.name}", "size": ${this.size}, "children": [${this.children.map(child => child.print()).join(", ")}]}`;
    }

    prettyPrint() {
        return JSON.stringify(JSON.parse(this.print()), null, 2);
    }

    getSubDirectoriesInfTo(maxSize) {
        let subDirs = [];
        this.children.forEach(child => {
            if (child.type === "directory") {
                if (child.size <= maxSize) {
                    subDirs = [child, ...subDirs];
                }
                subDirs = [...child.getSubDirectoriesInfTo(maxSize), ...subDirs];
            } 
        });
        return subDirs;
    }

    _findDirectoryToDelete(minSpaceToFree) {
        let candidateSubDirs = [];
        this.children.forEach(child => {
            if (child.type === "directory") {
                if (child.size >= minSpaceToFree) {
                    candidateSubDirs = [child, ...candidateSubDirs];
                }
                candidateSubDirs = [...child._findDirectoryToDelete(minSpaceToFree), ...candidateSubDirs];
            }
        });
        return candidateSubDirs;
    }

    findDirectoryToDelete(minSpaceToFree) {
        let candidateSubDirs = this._findDirectoryToDelete(minSpaceToFree);
        return candidateSubDirs.sort((subDirA, subDirB) => subDirA.size - subDirB.size)[0];
    }
}

function buildFileSystem(terminalLines) {
    const tree = new Directory("/", null);
    let cursor = tree;
    for (let index = 0; index < terminalLines.length; index++) {
        const terminalLine = terminalLines[index];
        if (terminalLine.startsWith("$")) {
            // command
            const [command, arg] = terminalLine.split(" ").slice(1);
            if (command === "cd") {
                // case command cd
                if (arg === "/") {
                    cursor = cursor.goToRoot();
                } else if (arg === "..") {
                    cursor = cursor.goToParent();
                } else {
                    cursor = cursor.cdFile(arg);
                }
            } else if ( command === "ls") {
                // case command ls
                let index2 = index + 1;
                while (index2 < terminalLines.length && !terminalLines[index2].startsWith("$")) {
                    // for each file or directory inside current dir
                    const subTerminalLine = terminalLines[index2];
                    if (subTerminalLine.startsWith("dir")) {
                        // case dir
                        const dirname = subTerminalLine.split(" ")[1];
                        cursor.addFile(new Directory(dirname, cursor));
                    } else {
                        // case file
                        const [size, filename] = subTerminalLine.split(" ");
                        cursor.addFile(new File(filename, size, cursor));
                    }
                    index2++;
                }
                index = index2 - 1;
            }
        }
    }
    return tree;
}

function getUnusedSpace(totalDiskSpace, fileSystem) {
    return totalDiskSpace - fileSystem.size;
}

function getMinSpaceToFree(targetMinUnusedSpace, unusedSpace) {
    return targetMinUnusedSpace - unusedSpace;
}

function puzzle1() {
    const terminalLines = fs.readFileSync('input1.txt', 'utf-8').split(/\r?\n/).slice(0, -1);;
    const fileSystem = buildFileSystem(terminalLines);
    const sum = fileSystem.getSubDirectoriesInfTo(100000).reduce((acc, dir) => acc + dir.size, 0);
    console.log(sum);
}

function puzzle2() {
    const terminalLines = fs.readFileSync('input1.txt', 'utf-8').split(/\r?\n/).slice(0, -1);;
    const fileSystem = buildFileSystem(terminalLines);
    const unusedSpace = getUnusedSpace(70000000, fileSystem);
    const targetMinUnusedSpace = 30000000;
    const minSpaceToFree = getMinSpaceToFree(targetMinUnusedSpace, unusedSpace);
    const directoryToDelete = fileSystem.findDirectoryToDelete(minSpaceToFree);
    console.log(directoryToDelete.size);
}

// puzzle1();
puzzle2();