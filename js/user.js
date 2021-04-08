const usernameRegex = /^[A-Za-z0-9 .]{3,30}$/;
const emailRegex = /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

$.post('../api/get-user.php', {}, (res) => {
    $('#username-placeholder').text(res);
    $('#logout-button').click(logout);
});

function fetchUserData() {
    $.post('../api/user-data-new.php', {}, (res) => {
        res = JSON.parse(res);
        if (res.status == 'success') {
            $('.email .data').text(res.email);
            $('.username .data').text(res.username);
            if ((res.reservations.length ?? 0) > 0) {
                $('.reserved-seats').removeClass('hidden');
                $('.reserved-seats .data')[0].innerHTML = '';
                for (let reservation of res.reservations) {
                    let str = `<p class="reservation">${
                        reservation.date
                    }, Reihe ${reservation.row}, Plätze ${Math.min(
                        ...reservation.cols
                    )}-${Math.max(...reservation.cols)}</p>`;
                    $('.reserved-seats .data')[0].innerHTML += str;
                }
            }
        } else {
            logout();
        }
    });
}

function logout() {
    $.post('../api/reset-session.php', {}, (res) => console.log(res));
    deleteCookie('loggedOn');
    setTimeout(() => {
        window.location.href = '../login/';
    }, 10);
}

function loadInput(e) {
    let btn = e.target;
    let container = btn.classList[0].replace('change-', '');
    toggleData(container);
    $(`.${container} button`).text('Speichern');
    $(`.${container} button`).unbind();
    $(`.${container} button`).click(saveData);
}

function saveData(e) {
    let btn = e.target;
    let container = btn.classList[0].replace('change-', '');

    let req = {};
    let val = $(`.${container} .input`)[0].value;
    if (
        (container == 'email' && emailRegex.test(val)) ||
        (container == 'username' && usernameRegex.test(val))
    ) {
        req[container] = val;
        $.post('../api/change-data.php', req, (res) => {
            res = JSON.parse(res);

            if (res.status == 'success') {
                toggleData(container);
                $(`.${container} button`).text('Ändern');
                fetchUserData();
                $(`.${container} button`).unbind();
                $(`.${container} button`).click(loadInput);
            } else {
                $(`.${container} .input`).addClass('invalid');
            }
        });
    } else {
        $(`.${container} .input`).addClass('invalid');
    }
}

function toggleData(container) {
    $(`.${container} .input`).toggleClass('hidden');
    $(`.${container} .input`)[0].value = '';
    $(`.${container} .data`).toggleClass('hidden');
}

$('.account-data > div > button').click(loadInput);

for (let input of $('.input')) {
    input.addEventListener('input', () => {
        input.classList.remove('invalid');
    });
}

fetchUserData();
