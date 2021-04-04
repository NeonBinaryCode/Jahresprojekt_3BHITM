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

$id = $_POST['id'];

$sql = "SELECT `title`, `posterurl` 'poster', `description`, `information` FROM `movie` WHERE `id` = $id";

if ($res = $connection->query($sql)) {
    $answer = $res->fetch_assoc();
    $res->close();
}

$sql = "SELECT `date`, `seats`, `id` FROM `showing` WHERE `movieid` = $id";
if ($res = $connection->query($sql)) {
    $answer['showings'] = [];
    while ($row = $res->fetch_assoc()) {
        $row['seats'] = json_decode($row['seats']);
        $answer['showings'][] = $row;
    }
    $res->close();
}

$sql = "SELECT `username`, `rating`, `message` FROM `rating`
INNER JOIN `user` ON `user`.`id` = `rating`.`userid`
WHERE `movieid` = $id";
if ($res = $connection->query($sql)) {
    $answer['ratings'] = [];
    while ($row = $res->fetch_assoc()) {
        $answer['ratings'][] = $row;
    }
    $res->close();
}

$connection->close();
echo json_encode($answer);
