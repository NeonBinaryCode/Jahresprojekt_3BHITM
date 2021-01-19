<?php
require 'parse-json.php';
$id = $_POST['id'];
$jsonContent = parseJson('movies.json')['movies'];

foreach ($jsonContent as $movie) {
    if ($movie['id'] == $id) {
        $answer = $movie;
        break;
    }
}

echo json_encode($answer);