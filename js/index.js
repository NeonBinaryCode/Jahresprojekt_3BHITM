let leftArrow = $('.arrow-left');
let rightArrow = $('.arrow-right');

function forward() {
    const length = $('.movie-card').length;

    for (let i = 1; i <= $('.movie-card').length; i++) {
        $('.movie-card-' + i).addClass('movie-card-' + (i - 1));
        $('.movie-card-' + i).removeClass('movie-card-' + i);
    }
    $('.movie-card-0').addClass('movie-card-' + length);
    $('.movie-card-0').removeClass('movie-card-0');
}

function back() {
    const length = $('.movie-card').length;
    for (let i = length; i >= 1; i--) {
        $('.movie-card-' + i).addClass('movie-card-' + (i + 1));
        $('.movie-card-' + i).removeClass('movie-card-' + i);
    }

    $('.movie-card-' + (length + 1)).addClass('movie-card-1');
    $('.movie-card-' + (length + 1)).removeClass('movie-card-' + (length + 1));
}

function fetchData() {
    $.post('../api/get-movies-new.php', (data) => {
        data = JSON.parse(data);
        let currentCount = 1;

        for (let movie of data) {
            let html = `<a href="../movie?id=${
                movie.id
            }" class="movie-card movie-card-${currentCount++}">
                <img src="../media/tempposter.jpg" alt="Movie Poster" class="movie-poster">
                <p class="movie-title">${movie.title}</p>
                <p class="movie-description">${movie.description}</p>
                </a>`;
            $('#movie-cards')[0].innerHTML += html;
        }
        resizeImageRow();
    });
}

fetchData();

function resizeImageRow() {
    $('.row-movie-cards').height($('.movie-card-1').outerHeight());
}

window.onresize = resizeImageRow;

leftArrow.click(back);
rightArrow.click(forward);
