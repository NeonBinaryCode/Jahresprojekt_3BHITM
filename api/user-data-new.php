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

$user = isset($_SESSION['user']) ? $_SESSION['user']['username'] : '';

if (strlen($user) > 0) {
    $answer = ['status' => 'success', 'email' => $_SESSION['user']['email'], 'username' => $user];

    $sql = "SELECT *  FROM `reservation` INNER JOIN `showing`ON (`reservation`.`showingid`=`showing`.`id`) WHERE `userid`=" .  (isset($_SESSION['user']['id']) ? $_SESSION['user']['id'] : -1);
    if ($res = $connection->query($sql)) {
        $reservations = [];
        while ($row = $res->fetch_assoc()) {
            $reservations[] = ['date' => $row['date'], 'row' => $row['row'], 'cols' => json_decode($row['cols'])];
        }
        $answer['reservations'] = $reservations;
    }
} else {
    $answer = ['status' => 'fail', 'message' => 'Nicht angemeldet'];
}

echo json_encode($answer);
