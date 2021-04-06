function fetchData() {
    $.post('../api/get-movies-new.php', { query: getQuery('q') }, (data) => {
        data = JSON.parse(data);

        for (let movie of data) {
            let html = `<a href="../movie?id=${movie.id}" class="movie-card">
                <img src="../media/tempposter.jpg" alt="Movie Poster" class="movie-poster">
                <p class="movie-title">${movie.title}</p>
                <p class="movie-description">${movie.description}</p>
                </a>`;
            $('.search-result')[0].innerHTML += html;
        }

        if (data.length == 0) {
            $('.search-result').load('./no-results.html');
        }
        resizeImageRow();
    });
}

fetchData();

function resizeImageRow() {
    $('.row-movie-cards').height($('.movie-card-1').outerHeight());
}

$('#query-placeholder').text(getQuery('q'));

window.onresize = resizeImageRow;
