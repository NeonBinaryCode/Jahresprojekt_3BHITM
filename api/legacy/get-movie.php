<?php
require 'parse-json.php';
require 'file-path.php';
$id = $_POST['id'];
$jsonContent = parseJson(filePath . 'movies.json')['movies'];

foreach ($jsonContent as $movie) {
    if ($movie['id'] == $id) {
        $answer = $movie;
        break;
    }
}

echo json_encode($answer);
