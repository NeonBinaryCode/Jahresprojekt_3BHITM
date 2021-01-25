<?php
require 'parse-json.php';
require 'file-path.php';
$jsonContent = parseJson(filePath . "movies.json")['movies'];

$answer = [];
foreach ($jsonContent as $movie) {
    $answer[] = [
        'id' => $movie['id'],
        'title' => $movie['title'],
        'description' => $movie['description']
    ];
}

echo json_encode($answer);
