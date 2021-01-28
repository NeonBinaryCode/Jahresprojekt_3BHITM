<?php
require 'parse-json.php';
require 'file-path.php';
$id = $_POST['id'];
$date = $_POST['date'];
$seats = $_POST['seats'];
$jsonContent = parseJson(filePath . 'movies.json')['movies'];

$answer['status'] = 'success';

for ($i = 0; $i < count($seats); $i++) {
    for ($j = 0; $j < count($seats[$i]); $j++) {
        switch ($seats[$i][$j]) {
            case 2:
                $seats[$i][$j] = 1;
                break;
            case 3:
                $seats[$i][$j] = 0;
                break;
        }
    }
}

for ($i = 0; $i < count($jsonContent); $i++) {
    $movie = $jsonContent[$i];
    if ($movie['id'] == $id) {
        for ($j = 0; $j < count($movie['showings']); $j++) {
            $showing = $movie['showings'][$j];
            if ($showing['date'] == $date) {
                $jsonContent[$i]['showings'][$j]['seats'] = $seats;
                file_put_contents(filePath . 'movies.json', json_encode(['movies' => $jsonContent]));
                break;
            }
        }
        break;
    }
}

echo json_encode($answer);
