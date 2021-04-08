let loginDiv = $('.login');
let signupDiv = $('.signup');
let coverup = $('.coverup');

const usernameRegex = /^[A-Za-z0-9 .]{3,30}$/;
const passwordRegex = /^[^\s;{}[\]]{8,30}$/;
const emailRegex = /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

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

    if (
        pwd1 == pwd2 &&
        passwordRegex.test(pwd1) &&
        usernameRegex.test(name) &&
        emailRegex.test(email)
    ) {
        let data = {
            email: email,
            username: name,
            password: pwd1,
            password2: pwd2,
        };
        console.log(data);
        $.post('../api/sign-up-new.php', data, (res) => {
            console.log(res);
            res = JSON.parse(res);
            if (res.status == 'success') {
                console.log(res);
                // setCookie('token', res.token);
                // setCookie('user', name);
                location.reload();
            }
        });
    } else {
        console.log(
            'Data invalid',
            passwordRegex.test(pwd1),
            usernameRegex.test(name),
            emailRegex.test(email)
        );
        if (!passwordRegex.test(pwd1)) {
            $('.password.input').addClass('invalid');
        }
        if (!passwordRegex.test(pwd2)) {
            $('.password-verify.input').addClass('invalid');
        }
        if (!usernameRegex.test(name)) {
            $('.username.input').addClass('invalid');
        }
        if (!emailRegex.test(email)) {
            $('.email.input').addClass('invalid');
        }
    }
}

function login() {
    let name = $('#username-login-input').val();
    let pwd = $('#password-login-input').val();

    let data = { username: name, password: pwd };
    $.post('../api/login-new.php', data, (res) => {
        res = JSON.parse(res);
        if (res.status == 'success') {
            document.location = document.referrer;
        } else {
            $('.output p').text(res.message);
            setTimeout(() => {
                $('.output p').text('');
            }, 5000);
        }
    });
}

for (let input of $('.input')) {
    input.getElementsByTagName('input')[0].addEventListener('input', () => {
        input.classList.remove('invalid');
    });
}

$('#signup-button').click(signup);
$('#login-button').click(login);

switchCover();
