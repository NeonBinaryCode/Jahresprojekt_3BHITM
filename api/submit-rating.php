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

if (isset($_SESSION['user']['id'])) {
    $user = $_SESSION['user']['id'];
    $movie = isset($_POST['movie']) ? $connection->real_escape_string($_POST['movie']) : -1;
    $rating = isset($_POST['rating']) ? $_POST['rating'] : -1;
    $message = isset($_POST['message']) ? $connection->real_escape_string($_POST['message']) : '';

    $sql = "SELECT * FROM `rating` WHERE `userid`=$user AND `movieid`=$movie";
    if ($res = $connection->query($sql)) {
        if ($res->num_rows > 0) {
            $answer = ['status' => 'fail', 'message' => 'Already submitted rating', 'sql' => $sql];
        } else if ($rating <= 0 || $rating > 5 || strlen($message) <= 0) {
            $answer = ['status' => 'fail', 'message' => 'Invalid data'];
        } else {
            $sql = "INSERT INTO `rating`(`userid`, `rating`, `message`, `movieid`) 
            VALUES ($user,$rating,'$message',$movie)";
            if ($connection->query($sql)) {
                $answer = ['status' => 'success', 'message' => 'Rating submitted'];
            } else {
                $answer = ['status' => 'fail', 'message' => 'Invalid data'];
            }
        }
    } else {
        $answer = ['status' => 'fail', 'message' => 'Invalid movie id'];
    }
} else {
    $answer = ['status' => 'fail', 'message' => 'Not logged in'];
}

$connection->close();
echo json_encode($answer);
