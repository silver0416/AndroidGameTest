document.addEventListener("DOMContentLoaded", function() {
    generateSudoku();
});

function generateSudoku() {
    let sudokuTable = document.getElementById("sudokuTable");
    let puzzle = generateEmptyPuzzle();
    let userInput = generateEmptyPuzzle(); // 存儲使用者輸入的數字

    // 開始填充數獨盤面
    fillSudoku(puzzle);

    // // 將生成的數獨盤面填入表格中
    // for (let i = 0; i < 9; i++) {
    //     let row = sudokuTable.insertRow(i);
    //     for (let j = 0; j < 9; j++) {
    //         let cell = row.insertCell(j);
    //         cell.textContent = puzzle[i][j];
    //     }
    // }

    // 將生成的數獨盤面填入表格中
    for (let i = 0; i < 9; i++) {
        let row = sudokuTable.insertRow(i);
        for (let j = 0; j < 9; j++) {
            let cell = row.insertCell(j);
            if (Math.random() < 0.3) { // 隨機將一半的格子設為空
                puzzle[i][j] = 0;
                let input = document.createElement("input");
                input.type = "text"; // 使用 text 類型，以允許空白
                input.maxLength = 1; // 限制輸入長度為 1
                input.addEventListener("input", function() {
                    // 確保使用者輸入的值為1到9的數字，或者保留為空
                    if (this.value !== "" && (this.value < 1 || this.value > 9 || !Number.isInteger(Number(this.value)))) {
                        this.value = "";
                    }
                    userInput[i][j] = this.value; // 更新使用者輸入的數字
                    // 檢查當前輸入是否合法
                    if (this.value !== "" && !isValidInput(puzzle, userInput, i, j, this.value)) {
                        this.classList.add("error");
                    } else {
                        this.classList.remove("error");
                    }
                });
                cell.appendChild(input);
            } else {
                cell.textContent = puzzle[i][j];
            }
        }
    }
}

function generateEmptyPuzzle() {
    // 生成一個9x9的空數獨盤面
    let puzzle = [];
    for (let i = 0; i < 9; i++) {
        puzzle[i] = [];
        for (let j = 0; j < 9; j++) {
            puzzle[i][j] = 0;
        }
    }
    return puzzle;
}

function generateRandomArray() {
    // 生成包含 1 到 9 的數組
    let baseArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // 洗牌算法，將陣列順序打亂
    for (let i = baseArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baseArray[i], baseArray[j]] = [baseArray[j], baseArray[i]];
    }

    return baseArray;
}

function fillSudoku(puzzle) {
    numbers = generateRandomArray();
    // 使用遞歸填充數獨盤面
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (puzzle[i][j] === 0) {
                for (let index = 0; index < 9; index++) {
                    if (isValid(puzzle, i, j, numbers[index])) {
                        puzzle[i][j] = numbers[index];
                        if (fillSudoku(puzzle)) {
                            return true;
                        }
                        puzzle[i][j] = 0; // 回溯
                    }
                }
                return false; // 當前位置無法填充
            }
        }
    }
    return true; // 整個盤面都填充完畢
}

function isValid(puzzle, row, col, num) {
    // 檢查在特定位置填充數字是否符合數獨規則
    for (let i = 0; i < 9; i++) {
        if (puzzle[row][i] === num || puzzle[i][col] === num || puzzle[Math.floor(row / 3) * 3 + Math.floor(i / 3)][Math.floor(col / 3) * 3 + i % 3] === num) {
            return false;
        }
    }
    return true;
}

function isValidInput(puzzle, userInput, row, col, value) {
    // 檢查當前輸入是否合法，包括使用者已經輸入的數字
    // 檢查行
    for (let i = 0; i < 9; i++) {
        if (i !== col && (puzzle[row][i] == value || userInput[row][i] == value)) {
            return false;
        }
    }
    // 檢查列
    for (let i = 0; i < 9; i++) {
        if (i !== row && (puzzle[i][col] == value || userInput[i][col] == value)) {
            return false;
        }
    }
    // 檢查3x3區域
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if ((i !== row || j !== col) && (puzzle[i][j] == value || userInput[i][j] == value)) {
                return false;
            }
        }
    }
    return true;
}