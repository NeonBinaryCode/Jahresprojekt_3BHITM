// (() => {

let states = [];
const w = 400;
const h = 400;
const padding = 25;
const gap = 15;
const rows = 10;
const cols = 15;
const usableWidth = w - padding * 2;
const usableHeight = h - padding * 2 + gap;
const seatWidth = usableWidth / cols;
const seatHeight = usableHeight / rows - gap;
let count = parseInt($('#select-person-count')[0].value);

for (let i = 0; i < rows; i++) {
    states[i] = [];
    for (let j = 0; j < cols; j++) {
        states[i][j] = 0;
    }
}

states[2][2] = 1;
states[2][3] = 1;

states[2][13] = 1;
states[2][14] = 1;

states[5][6] = 1;
states[5][7] = 1;
states[5][8] = 1;
states[5][9] = 1;

function setup() {
    let canvas = createCanvas(w, h);
    $('#container-canvas').html('');
    canvas.parent('container-canvas');

    // Lücken zwischen Sitzplätzen um Corona-konform zu sein, später am Server
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if ((states[i][j - 1] == 1 || states[i][j + 1] == 1) && states[i][j] != 1)
                states[i][j] = 3;
        }
    }
}

function draw() {
    let newCount = parseInt($('#select-person-count')[0].value);
    if (count != newCount) {
        count = newCount;
        clearSelectedSeats();
    }
    background(255);
    for (let i = 0; i < rows; i++) {
        let y = padding + i * seatHeight + i * gap;
        for (let j = 0; j < cols; j++) {
            let x = padding + j * seatWidth;
            stroke(0);
            setFill(states[i][j])
            rect(x, y, seatWidth, seatHeight);
            if (states[i][j] == 3) {
                stroke(255, 0, 0);
                line(x + 1, y + 1, x + seatWidth - 1, y + seatHeight - 1);
                line(x + seatWidth - 1, y + 1, x + 1, y + seatHeight - 1);
            }
        }
    }
}

function setFill(state) {
    switch (state) {
        case 0:
            fill(255);
            break;
        case 1:
            fill(160);
            break;
        case 2:
            fill(100, 150, 100);
            break;
        case 3:
            fill(230);
            break;
        default:
            fill(0);
    }
}

function mousePressed() {
    const seat = getMouseSeat();
    if (seat) {
        let row = seat[0];
        let col = seat[1];

        if (states[row][col] != 1) {
            let diff = getDiff(row, col);
            if (diff != -1) {
                clearSelectedSeats();
                for (let i = 0; i < count; i++) {
                    states[row][col - diff + i] = 2;
                }
            }
        }
    }
}

function clearSelectedSeats() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (states[i][j] == 2) states[i][j] = 0;
        }
    }
}

function getDiff(row, col) {
    let diff = Math.floor(count / 2);
    let step = 0;
    let inc = true;
    let clear;
    do {
        clear = true;
        if (inc) diff += step;
        else diff -= step;
        inc = !inc;
        step++;
        if (step > count) {
            return -1;
        }
        if (col - diff < 0 || col + (count - diff) > cols) {
            clear = false;
        } else {
            for (let i = 0; i < count; i++) {
                let x = states[row][col - diff + i];
                if (x == 1 || x == 3) {
                    clear = false;
                    break;
                }
            }
        }
    } while (!clear);
    return diff;
}

function getMouseSeat() {
    for (let i = 0; i < rows; i++) {
        let y = padding + i * seatHeight + i * gap;
        if (mouseY >= y && mouseY <= y + seatHeight) {
            for (let j = 0; j < cols; j++) {
                let x = padding + j * seatWidth;
                if (mouseX >= x && mouseX <= x + seatWidth) {
                    return [i, j];
                }
            }
            return false;
        }
    }
    return false;
}
// })();