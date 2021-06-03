// (() => {

let states = [];
const w = 400;
const h = 500;
const padding = 25;
const gap = 15;
const headerHeight = 50;
const footerHeight = 50;
const rows = 10;
const cols = 15;
const usableWidth = w - padding * 2;
const usableHeight = h - padding * 2 + gap - headerHeight - footerHeight;
const seatWidth = usableWidth / cols;
const seatHeight = usableHeight / rows - gap;
let count = parseInt($('#select-person-count')[0].value);
let selectedRow = -1;
let selectedCols = -1;

loadData();

function setup() {
    let canvas = createCanvas(w, h);
    $('#container-canvas').html('');
    canvas.parent('container-canvas');
}

function draw() {
    let newCount = parseInt($('#select-person-count')[0].value);
    if (count != newCount) {
        count = newCount;
        clearSelectedSeats();
    }
    background(255);
    if (states.length > 0) {
        drawHeader();
        drawFooter();
        rectMode(CORNER);
        for (let i = 0; i < rows; i++) {
            let y = padding + i * seatHeight + i * gap + headerHeight;
            for (let j = 0; j < cols; j++) {
                let x = padding + j * seatWidth;
                stroke(0);
                setFill(states[i][j]);
                rect(x, y, seatWidth, seatHeight);
                if (states[i][j] == 3) {
                    stroke(255, 0, 0);
                    line(x + 1, y + 1, x + seatWidth - 1, y + seatHeight - 1);
                    line(x + seatWidth - 1, y + 1, x + 1, y + seatHeight - 1);
                }
            }
        }
    }
}

function drawHeader() {
    stroke(0);
    line(padding, padding, w - padding, padding);
    textAlign(CENTER);
    fill(0);
    text('Leinwand', w / 2, padding + 20);
}

function drawFooter() {
    const y = h - padding - footerHeight / 2;
    rectMode(CENTER);
    textAlign(CENTER);
    fill(0);
    const max = 4;
    for (let i = 0; i < max; i++) {
        setFill(i);
        const l = padding + (i * usableWidth) / max + usableWidth / max / 4;
        const t = y - seatHeight / 2;
        const r = l + seatWidth;
        const b = t + seatHeight;

        rect((l + seatWidth + r) / 2, y, seatWidth, seatHeight);

        if (i == 3) {
            stroke(255, 0, 0);
            line(l + seatWidth / 2 + 1, t + 1, r + seatWidth / 2 - 1, b - 1);
            line(l + seatWidth / 2 + 1, b - 1, r + seatWidth / 2 - 1, t + 1);
            stroke(0);
        }

        fill(0);
        let txt;
        switch (i) {
            case 0:
                txt = 'frei';
                break;
            case 1:
                txt = 'besetzt';
                break;
            case 2:
                txt = 'gewählt';
                break;
            case 3:
                txt = 'gesperrt';
                break;
        }
        text(txt, (l + seatWidth + r) / 2, y + footerHeight / 2);
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
        selectedRow = row;
        let col = seat[1];
        selectedCols = [];

        if (states[row][col] != 1) {
            let diff = getDiff(row, col);
            if (diff != -1) {
                clearSelectedSeats();
                for (let i = 0; i < count; i++) {
                    states[row][col - diff + i] = 2;
                    selectedCols.push(col - diff + i);
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
        let y = padding + i * seatHeight + i * gap + headerHeight;
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

function bookSeats() {
    let seatCount = 0;
    for (let row of states) {
        for (let seat of row) {
            if (seat == 2) {
                seatCount++;
            }
        }
    }
    if (seatCount == count) {
        let data = {
            id: getQuery('id'),
            row: selectedRow,
            cols: selectedCols,
        };
        $.post('../api/submit-seating-new.php', data, (res) => {
            res = JSON.parse(res);
            if (res.status == 'success') {
                document.location = document.referrer;
            }
        });
    }
}

async function loadData() {
    
    $.post('../api/get-opted-in.php', {} , (data) => {
        console.log(data == "");
        if (data == "" || parseInt(data) == 0) {
            $('.btn-book')[0].disabled = true;
            $('.btn-book').addClass('disabled');
        }
    })

    let data = {
        id: getQuery('id'),
    };
    $.post('../api/get-seating-new.php', data, (res) => {
        states = JSON.parse(res).seats;
        // Lücken zwischen Sitzplätzen um Corona-konform zu sein, später am Server
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                states[i][j] = Number(states[i][j]);
                if (
                    (states[i][j - 1] == 1 || states[i][j + 1] == 1) &&
                    states[i][j] != 1
                )
                    states[i][j] = 3;
            }
        }
    });
}

$('.btn-book').click(bookSeats);
