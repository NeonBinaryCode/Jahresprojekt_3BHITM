<?php
session_start();

$db_host = 'localhost';
$db_name = 'lensscape';
$db_username = 'lensscape';
$db_password = 'lensscape';

$connection = new mysqli($db_host, $db_username, $db_password, $db_name);

if ($connection->connect_error) {
    die('Database connection failed: ' . $connection->connect_error);
}

$id = isset($_POST['id']) ? $connection->real_escape_string($_POST['id']) : -1;

$answer['status'] = 'failed';

$sql = "SELECT `seats` FROM `showing` WHERE `id` = $id";

if ($res = $connection->query($sql)) {
    if ($seats = $res->fetch_assoc()) {
        $seats = json_decode($seats['seats']);
        if (count($seats) == 0) {
            for ($i = 0; $i < 10; $i++) {
                $seats[$i] = [];
                for ($j = 0; $j < 15; $j++) {
                    $seats[$i][$j] = 0;
                }
            }
            file_put_contents(filePath . 'movies.json', json_encode(['movies' => $jsonContent]));
        }
        $answer['seats'] = $seats;
        $answer['status'] = 'found';
    }
    $res->close();
}

$connection->close();

echo json_encode($answer);
