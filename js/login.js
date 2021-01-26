let loginDiv = $('.login');
let signupDiv = $('.signup');
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
}

function signup() {
    let email = $('#email-signup-input').val();
    let name = $('#username-signup-input').val();
    let pwd1 = $('#password-signup-input').val();
    let pwd2 = $('#password-verify-signup-input').val();

    if (pwd1 == pwd2 && pwd1.length > 3 && name.length > 3) {
        let data = { email: email, username: name, password: pwd1 };
        console.log(data);
        $.post('../api/sign-up.php', data, (res) => {
            res = JSON.parse(res);
            if (res.status == 'success') {
                console.log(res);
                setCookie('token', res.token);
                setCookie('user', name);
                document.location = document.referrer;
            }
        });
    }
}

function login() {
    let name = $('#username-login-input').val();
    let pwd = $('#password-login-input').val();

    let data = { username: name, password: pwd };
    console.log(data);
    $.post('../api/login.php', data, (res) => {
        res = JSON.parse(res);
        if (res.status == 'success') {
            console.log(res);
            setCookie('token', res.token);
            setCookie('user', name);
            document.location = document.referrer;
        }
    });
}

$('#signup-button').click(signup);
$('#login-button').click(login);

switchCover();
