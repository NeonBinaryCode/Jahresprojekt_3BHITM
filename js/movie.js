function fetchData() {
    $.post('../api/get-movie.php', { id: getQuery('id') }, (data) => {
        data = JSON.parse(data);
        $('.movie-poster')[0].src = `../media/${data.poster}`;
        $('.movie-title').text(data.title);
        $('.movie-description').text(data.description);
        $('#start-reservation')[0].href = `../book-seats/?id=${data.id}`;
        let informationHtml = '';
        for (const key in data.information) {
            const val = data.information[key];
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
    });
}

fetchData();