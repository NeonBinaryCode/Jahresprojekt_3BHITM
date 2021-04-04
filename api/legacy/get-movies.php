<?php
require 'parse-json.php';
require 'file-path.php';
$jsonContent = parseJson(filePath . "movies.json")['movies'];

$query = isset($_POST['query']) && strlen($_POST['query'] > 0) ? $_POST['query'] : false;

$answer = [];
foreach ($jsonContent as $movie) {
    if (!$query || stripos($movie['title'], $query) !== false) {
        $answer[] = [
            'id' => $movie['id'],
            'title' => $movie['title'],
            'description' => $movie['description']
        ];
    }
}

echo json_encode($answer);
