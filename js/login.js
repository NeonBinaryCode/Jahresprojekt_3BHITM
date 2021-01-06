let login = $('.login');
let signup = $('.signup');
let coverup = $('.coverup');

const coverFiles = ['./cover-login.html', './cover-signup.html'];
let currentCover = 1;

function switchForm() {
    coverup.toggleClass('left');
    coverup.toggleClass('right');
    switchCover();
}

function switchCover() {
    if (++currentCover == 2) currentCover = 0;
    coverup.load(coverFiles[currentCover]);
};

switchCover();