(() => {
    let id = -1;
    let selectDate = $('#select-date')[0];
    function fetchData() {
        $.post('../api/get-movie-new.php', { id: getQuery('id') }, (data) => {
            data = JSON.parse(data);
            data.information = JSON.parse(data.information);
            console.log(data);
            $('.movie-poster')[0].src = `../media/${data.poster}`;
            $('.movie-title').text(data.title);
            $('.movie-description').text(data.description);
            id = data.id;
            let informationHtml = '';
            for (let key in data.information) {
                let val = data.information[key];
                if (typeof val == 'object') {
                    for (let i = 0; i < val.length; i++) {
                        informationHtml += '<tr><td>';
                        if (i == 0) informationHtml += key;
                        informationHtml += `</td><td>${val[i]}</td</tr>\n`;
                    }
                } else {
                    informationHtml += `<tr><td>${key}</td><td>${val}</td</tr>\n`;
                }
            }
            $('.general-information').html(informationHtml);

            $('#select-date')[0].innerHTML = '';
            for (let showing of data.showings) {
                let date = showing.date;
                $(
                    '#select-date'
                )[0].innerHTML += `<option value="${showing.id}">${date}</option>`;
            }
            updateLink();

            let averageRating = 0;
            for (let rating of data.ratings) {
                averageRating += Number(rating.rating);
            }
            averageRating /= data.ratings.length;
            averageRating = Math.round(averageRating);
            let stars = [
                '<i class="fas fa-star"></i>',
                '<i class="far fa-star"></i>',
            ];
            let ratingElem = $('.star-rating')[0];
            ratingElem.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                if (i < averageRating) {
                    ratingElem.innerHTML += stars[0];
                } else {
                    ratingElem.innerHTML += stars[1];
                }
            }
        });
    }

    fetchData();

    selectDate.addEventListener('change', updateLink);

    function updateLink() {
        $(
            '#start-reservation'
        )[0].href = `../book-seats/?id=${selectDate.value}`;
    }
})();
