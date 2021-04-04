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

$query = isset($_POST['query']) && strlen($_POST['query'] > 0) ? '%' . $connection->real_escape_string($_POST['query']) . '%' : '%';

$answer = [];

$sql = "SELECT `id`, `title`, `description` FROM `movie` WHERE `title` LIKE '$query'";

if ($res = $connection->query($sql)) {
    while ($row = $res->fetch_assoc()) {
        $answer[] = $row;
    }
    $res->close();
}

$connection->close();

echo json_encode($answer);
