'use strict'
const numberbox = document.getElementById("numberbox");
const slider = document.getElementById("slider");
const progressBar = document.getElementById("progress-bar");
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById("pause-button");

const queen = '<i class="fas fa-chess-queen" style="color:#000"></i>';

let n, speed, tempSpeed, Board = 0;


let NumberOfBoards = 0;

let pos = {};
let position = Object.assign({}, pos);
let uuid = [];


let isPaused = false;

pauseButton.onclick = function () {
    isPaused = !isPaused;
    pauseButton.innerHTML = isPaused ? `<i class="fa fa-play" aria-hidden="true"></i> Play` : `<i class="fa fa-pause"></i> Pause`;
}


speed = (100 - slider.value) * 10;
tempSpeed = speed;
slider.oninput = function () {
    progressBar.style.width = this.value + "%";
    speed = slider.value;
    speed = (100 - speed) * 10;
}

// Function to solve the N-Queen problem
const nQueen = async () => {
    Board = 0;
    position[`${Board}`] = {};
    numberbox.disabled = true;
    await solveQueen(Board, 0, n);
    await clearColor(Board);
    numberbox.disabled = false;
}

const isValid = async (board, r, col, n) => {
    const table = document.getElementById(`table-${uuid[board]}`);
    const currentRow = table.firstChild.childNodes[r];
    const currentColumn = currentRow.getElementsByTagName("td")[col];
    currentColumn.innerHTML = queen;
    await delay();


    for (let i = r - 1; i >= 0; --i) {
        const row = table.firstChild.childNodes[i];
        const column = row.getElementsByTagName("td")[col];
        const value = column.innerHTML;

        if (value == queen) {
            column.style.backgroundColor = "#FB5607";
            currentColumn.innerHTML = "-";
            return false;
        }
        column.style.backgroundColor = "#eedc97";
        await delay();
    }


    for (let i = r - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
        const row = table.firstChild.childNodes[i];
        const column = row.getElementsByTagName("td")[j];
        const value = column.innerHTML;

        if (value == queen) {
            column.style.backgroundColor = "#fb5607";
            currentColumn.innerHTML = "-";
            return false;
        }
        column.style.backgroundColor = "#eedc97";
        await delay();
    }


    for (let i = r - 1, j = col + 1; i >= 0 && j < n; --i, ++j) {
        const row = table.firstChild.childNodes[i];
        const column = row.getElementsByTagName("td")[j];
        const value = column.innerHTML;

        if (value == queen) {
            column.style.backgroundColor = "#FB5607";
            currentColumn.innerHTML = "-";
            return false;
        }
        column.style.backgroundColor = "#eedc97";
        await delay();
    }
    return true;
}


const clearColor = async (board) => {
    for (let j = 0; j < n; ++j) {
        const table = document.getElementById(`table-${uuid[board]}`);
        const row = table.firstChild.childNodes[j];
        for (let k = 0; k < n; ++k) {
            (j + k) & 1
                ?

                (row.getElementsByTagName("td")[k].style.backgroundColor = "#80a352") :

                (row.getElementsByTagName("td")[k].style.backgroundColor = "#dad9b5");
        }
    }
}

const delay = async () => {
    while (isPaused) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
    await new Promise((done) => setTimeout(() => done(), speed));
}


const solveQueen = async (board, r, n) => {
    if (r == n) {
        ++Board;
        let table = document.getElementById(`table-${uuid[Board]}`);
        for (let k = 0; k < n; ++k) {
            let row = table.firstChild.childNodes[k];
            row.getElementsByTagName("td")[position[board][k]].innerHTML = queen;
        }
        position[Board] = position[board];
        return;
    }

    for (let i = 0; i < n; ++i) {
        await delay();
        await clearColor(board);
        if (await isValid(board, r, i, n)) {
            await delay();
            await clearColor(board);
            let table = document.getElementById(`table-${uuid[board]}`);
            let row = table.firstChild.childNodes[r];
            row.getElementsByTagName("td")[i].innerHTML = queen;

            position[board][r] = i;

            if (await solveQueen(board, r + 1, n)) await clearColor(board);

            await delay();
            board = Board;
            table = document.getElementById(`table-${uuid[board]}`);
            row = table.firstChild.childNodes[r];
            row.getElementsByTagName("td")[i].innerHTML = "-";

            delete position[`${board}`][`${r}`];
        }
    }
}

playButton.onclick = async function visualise() {
    this.disabled = true;
    const chessBoard = document.getElementById("n-queen-board");
    const arrangement = document.getElementById("queen-arrangement");

    n = numberbox.value;

    if (n < 1) {
        numberbox.value = "";
        alert("Queen value is too small");
        return;
    }

    NumberOfBoards = await getNumberOfBoards(n);



    while (chessBoard.hasChildNodes()) {
        chessBoard.removeChild(chessBoard.firstChild);
    }
    if (arrangement.hasChildNodes()) {
        arrangement.removeChild(arrangement.lastChild);
    }

    const para = document.createElement("p");
    para.setAttribute("class", "queen-info");
    para.innerHTML = `For ${n}x${n} board, ${NumberOfBoards} arrangements are possible.`;
    arrangement.appendChild(para);


    if (chessBoard.childElementCount === 0) {
        for (let i = 0; i < NumberOfBoards + 1; ++i) {
            uuid.push(Math.random());
            let div = document.createElement('div');
            let table = document.createElement('table');
            let header = document.createElement('h4');
            header.innerHTML = `Board ${i + 1}`;
            table.setAttribute("id", `table-${uuid[i]}`);
            header.setAttribute("id", `paragraph-${i}`);
            chessBoard.appendChild(div);
            div.appendChild(header);
            div.appendChild(table);
        }
    }


    for (let k = 0; k < NumberOfBoards + 1; ++k) {
        let table = document.getElementById(`table-${uuid[k]}`);
        for (let i = 0; i < n; ++i) {
            const row = table.insertRow(i);
            row.setAttribute("id", `Row${i}`);
            for (let j = 0; j < n; ++j) {
                const col = row.insertCell(j);
                (i + j) & 1
                    ?
                    (col.style.backgroundColor = "#80a352") :
                    (col.style.backgroundColor = "#dad9b5");
                col.innerHTML = "-";
                col.style.border = "0.3px solid #373f51";
            }
        }
        await clearColor(k);
    }
    await nQueen();
    let lastBoard = document.getElementById(`table-${uuid.pop()}`);
    lastBoard.parentElement.remove();
    this.disabled = false;
};

const getNumberOfBoards = async (n) => {
    let count = 0;
    let cols = new Set();
    let diag1 = new Set();
    let diag2 = new Set();

    async function backtrack(row) {
        if (row == n) {
            count++;
            return;
        }

        for (let col = 0; col < n; col++) {
            if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
                continue;
            }

            cols.add(col);
            diag1.add(row - col);
            diag2.add(row + col);


            await backtrack(row + 1);

            cols.delete(col);
            diag1.delete(row - col);
            diag2.delete(row + col);
        }
    }

    await backtrack(0);

    return count;
}
