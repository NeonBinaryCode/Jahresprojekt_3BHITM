if (!getCookie('user')) {
    window.location.href = '../login/';
} else {
    $('#username-placeholder').text(getCookie('user'));

    $('#logout-button').click(logout);

    function logout() {
        deleteCookie('user');
        deleteCookie('token');
        window.location.href = '../login/';
    }
}
