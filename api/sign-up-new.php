<?php

$db_host = 'localhost';
$db_name = 'lensscape';
$db_username = 'lensscape';
$db_password = 'lensscape';

session_start();
$connection = new mysqli($db_host, $db_username, $db_password, $db_name);

if ($connection->connect_error) {
    die('Database connection failed: ' . $connection->connect_error);
}

$username = $connection->real_escape_string($_POST['username']);
$password = $connection->real_escape_string($_POST['password']);
$password2 = $connection->real_escape_string($_POST['password2']);
$email = $connection->real_escape_string($_POST['email']);

if (strcmp($password, $connection->real_escape_string($_POST['password2'])) != 0) {
    $answer = ['status' => 'fail', 'message' => 'Passwörter stimmen nicht überein'];
    $connection->close();
    echo $answer;
    exit;
}

$password = 'safer' . $password;

$sql = "INSERT INTO `user` (`username`, `password`, `email`, `user_deleted`, `last_login`)
            VALUES ('$username', MD5('$password'), '$email', 0, NOW())";

if ($res = $connection->query($sql)) {
    $answer = ['message' => 'Account erstellt', 'status' => 'success'];
} else {
    $answer = ['status' => 'fail', 'message' => 'Name oder E-Mail existiert bereits'];
}

$connection->close();
echo json_encode($answer);
