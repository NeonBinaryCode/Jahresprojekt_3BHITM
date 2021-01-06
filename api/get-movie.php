<?php
$id = $_POST['id'];
$stringContent = file_get_contents('movies.json');
$jsonContent = json_decode($stringContent, true)['movies'];

foreach ($jsonContent as $movie) {
    if ($movie['id'] == $id) {
        $answer = $movie;
        break;
    }
}

echo json_encode($answer);