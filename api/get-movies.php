<?php
$stringContent = file_get_contents('movies.json');
$jsonContent = json_decode($stringContent, true)['movies'];

$answer = [];
foreach ($jsonContent as $movie) {
    $answer[] = [
        'id' => $movie['id'],
        'title' => $movie['title'],
        'description' => $movie['description']
    ];
}

echo json_encode($answer);