<?php
require 'parse-json.php';
require 'file-path.php';
$id = $_POST['id'];
$date = $_POST['date'];
$jsonContent = parseJson(filePath . 'movies.json')['movies'];


$answer['status'] = 'failed';

for ($i = 0; $i < count($jsonContent); $i++) {
    $movie = $jsonContent[$i];
    if ($movie['id'] == $id) {
        for ($j = 0; $j < count($movie['showings']); $j++) {
            $showing = $movie['showings'][$j];
            if ($showing['date'] == $date) {
                if (count($showing['seats']) == 0) {
                    for ($k = 0; $k < 10; $k++) {
                        $jsonContent[$i]['showings'][$j]['seats'][$k] = [];
                        for ($l = 0; $l < 15; $l++) {
                            $jsonContent[$i]['showings'][$j]['seats'][$k][$l] = 0;
                        }
                    }
                    file_put_contents(filePath . 'movies.json', json_encode(['movies' => $jsonContent]));
                }
                $answer['seats'] = $jsonContent[$i]['showings'][$j]['seats'];
                $answer['status'] = 'found';
                break;
            }
        }
        break;
    }
}

echo json_encode($answer);
