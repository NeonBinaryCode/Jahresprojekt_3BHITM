// Funktion versteckt enthaltene Funktionen und Variablen, auf die der Benutzer keinen Zugriff haben soll
$(document).ready(() => {
    setTimeout(() => {
        $('.preload').removeClass('preload');
    }, 500);
    $('#header').load('../include/header.html', initHeader);
    $('#footer').load('../include/footer.html', () => {
        $('#copyright-year').text(new Date().getFullYear());
    });

    let theme = getThemePreference();
    loadTheme();

    function initHeader() {
        initThemeSwitch();
        checkUser();
    }

    function initThemeSwitch() {
        $('#theme-switch').click(changeTheme);
    }

    function getThemePreference() {
        let theme = getCookie('theme');
        if (theme != 'light' && theme != 'dark') {
            // Abfrage nach dem System-Design, funktioniert bei mir nicht, aber auf MacOS scheinbar schon
            if (
                window
                    .getComputedStyle(document.documentElement)
                    .getPropertyValue('content')
                    .replace(/"/g, '') == 'dark'
            ) {
                theme = 'dark';
            } else {
                theme = 'light';
            }
        }
        return theme;
    }

    function changeTheme() {
        if (theme == 'light') {
            theme = 'dark';
        } else {
            theme = 'light';
        }
        loadTheme();
    }

    function loadTheme() {
        document.documentElement.setAttribute('data-theme', theme);
        setCookie('theme', theme);
    }

    function checkUser() {
        $.post('../api/get-user.php', {}, (res) => {
            if (res.length > 0) {
                setCookie('loggedOn', true, 1);
                loadUser();
            } else if (document.location.pathname.endsWith('user/')) {
                setCookie('loggedOn', false, 1);
                document.location.href = '../login/';
            }
            loadUser();
        });
    }

    // function checkCredentials() {
    //     if (getCookie('user') && getCookie('token')) {
    //         let data = {
    //             username: getCookie('user'),
    //             token: getCookie('token'),
    //         };
    //         $.post('../api/login.php', data, (res) => {
    //             res = JSON.parse(res);
    //             if (res.status == 'success') {
    //                 setCookie('token', res.token, 1);
    //                 setCookie('user', getCookie('user'), 1);
    //                 loadUser();
    //             } else {
    //                 deleteCookie('token');
    //                 deleteCookie('user');
    //                 if (document.location.pathname.endsWith('user/')) {
    //                     document.location.href = '../login/';
    //                 }
    //             }
    //         });
    //     }
    // }

    function loadUser() {
        if (getCookie('loggedOn')) {
            $('#dropdown-account')[0].href = '../user/';
            $('#dropdown-account .text').text('Account');

            if (document.location.pathname.endsWith('login/')) {
                document.location.href = $('#dropdown-account')[0].href;
            }
        }
    }
});

function setCookie(cname, cvalue, days = 30) {
    let expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + days);
    let path = window.location.pathname;
    path = path.split('/');
    path.pop();
    path.pop();
    path = path.join('/');
    document.cookie =
        cname +
        '=' +
        cvalue +
        ';SameSite=Lax;expires=' +
        expireDate.toUTCString() +
        ';Path=' +
        path;
}

function deleteCookie(cname) {
    let path = window.location.pathname;
    path = path.split('/');
    path.pop();
    path.pop();
    path = path.join('/');
    document.cookie =
        cname + '=;expires=' + new Date().toUTCString() + ';Path=' + path;
}

function getCookie(cname) {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

function getQuery(qname) {
    let name = qname + '=';
    let decodedQuery = decodeURIComponent(window.location.search).replace(
        '?',
        ''
    );
    let da = decodedQuery.split('&');
    for (let i = 0; i < da.length; i++) {
        let d = da[i];
        while (d.charAt(0) == ' ') {
            d = d.substring(1);
        }
        if (d.indexOf(name) == 0) {
            return d.substring(name.length, d.length);
        }
    }
    return '';
}
