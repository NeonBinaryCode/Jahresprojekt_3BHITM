$.post('../api/get-user.php', {}, (res) => {
    if (res.length == 0) {
        // window.location.href = '../login/';
    }

    $('#username-placeholder').text(res);
    $('#logout-button').click(logout);
});

function fetchUserData() {
    $.post('../api/user-data-new.php', {}, (res) => {
        res = JSON.parse(res);
        if (res.status == 'success') {
            $('.email .data').text(res.email);
            $('.name .data').text(res.username);
        } else {
            logout();
        }
    });
}

function logout() {
    deleteCookie('user');
    deleteCookie('token');
    window.location.href = '../login/';
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
    // request
    toggleData(container);
    $(`.${container} button`).text('Ändern');
    fetchUserData();
    $(`.${container} button`).unbind();
    $(`.${container} button`).click(loadInput);
}

function toggleData(container) {
    $(`.${container} .input`).toggleClass('hidden');
    $(`.${container} .data`).toggleClass('hidden');
}

$('.account-data > div > button').click(loadInput);

fetchUserData();
