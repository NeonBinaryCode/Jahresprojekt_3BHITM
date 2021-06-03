(() => {
    let starCount = 0;
    let selectDate = $('#select-date')[0];
    function fetchData() {
        $.post('../api/get-opted-in.php', {} , (data) => {
            console.log(data == "");
            if (data == "" || parseInt(data) == 0) {
                $('#start-reservation').addClass('disabled');
            }
        })

        $.post('../api/get-movie-new.php', { id: getQuery('id') }, (data) => {
            data = JSON.parse(data);
            data.information = JSON.parse(data.information);
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

            let ratingsDiv = $('.ratings')[0];
            if (data.ratings.length > 0) {
                let averageRating = 0;
                for (let rating of data.ratings) {
                    let str = `<div class="rating">
                                <div class="user">
                                    <img class="profilepicture" src="../media/profilepictures/${
                                        rating.profilepicture
                                    }?${performance.now()}" />
                                    <div class="name">${rating.username}</div>
                                </div>
                                <div class="stars">${'<i class="fas fa-star"></i>'.repeat(
                                    rating.rating
                                )}${'<i class="far fa-star"></i>'.repeat(
                        5 - rating.rating
                    )}</div>
                                <div class="text">${rating.message}</div>
                            </div>`;
                    ratingsDiv.innerHTML += str;
                    averageRating += Number(rating.rating);
                }
                averageRating /= data.ratings.length;
                averageRating = Math.round(averageRating);

                let ratingElem = $('.star-rating')[0];
                ratingElem.innerHTML = `${'<i class="fas fa-star"></i>'.repeat(
                    averageRating
                )}${'<i class="far fa-star"></i>'.repeat(5 - averageRating)}`;
            }

            if (!getCookie('loggedOn') || data.rated) {
                $('.your-rating').addClass('hidden');
                if (data.ratings.length == 0) {
                    $('.ratings').addClass('hidden');
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

    function submitRating() {
        let message = $('.your-rating textarea')[0].value;
        if (starCount <= 0 || starCount > 5) {
            $('.your-rating .star-select').addClass('invalid');
        }
        if (message.length <= 0) {
            $('.your-rating textarea').addClass('invalid');
        }

        if (starCount > 0 && starCount <= 5 && message.length > 0) {
            let req = {
                message: message,
                rating: starCount,
                movie: getQuery('id'),
            };
            $.post('../api/submit-rating.php', req, (res) => {
                res = JSON.parse(res);
                if (res.status == 'success') {
                    window.location.reload();
                } else {
                    $('.your-rating textarea').addClass('invalid');
                }
            });
        }
    }

    $('.your-rating textarea')[0].addEventListener('input', () => {
        $('.your-rating textarea').removeClass('invalid');
    });

    $('#submit-rating').click(submitRating);

    let elems = $('.star-select > *');
    for (let i = 0; i < elems.length; i++) {
        let elem = elems[i];
        elem.addEventListener('click', () => {
            $('.your-rating .star-select').removeClass('invalid');
            starCount = i + 1;
            for (let j = 0; j < elems.length; j++) {
                if (j <= i) {
                    elems[j].innerHTML = '<i class="fas fa-star"></i>';
                } else {
                    elems[j].innerHTML = '<i class="far fa-star"></i>';
                }
            }
        });
    }
})();
