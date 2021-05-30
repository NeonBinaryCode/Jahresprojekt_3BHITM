<?php
$db_host = 'localhost';
$db_name = 'lensscape';
$db_username = 'lensscape';
$db_password = 'lensscape';

session_start();
$connection = new mysqli($db_host, $db_username, $db_password, $db_name);
require "regex.php";

$username = $connection->real_escape_string($_POST['username']);
$password = $connection->real_escape_string($_POST['password']);
$password2 = $connection->real_escape_string($_POST['password2']);
$email = $connection->real_escape_string($_POST['email']);

$errors = [];
if (preg_match(usernameRegex, $username) == 0 | preg_match(usernameRegex, $username) == false) {
    $errors[] = 'username';
}
if (preg_match(emailRegex, $email) == 0 | preg_match(emailRegex, $email) == false) {
    $errors[] = 'email';
}
if (preg_match(passwordRegex, $password) == 0 | preg_match(passwordRegex, $password) == false) {
    $errors[] = 'password';
}
if ($password2 != $password) {
    $errors[] = 'password2';
}

if (count($errors) == 0) {
    if ($connection->connect_error) {
        die('Database connection failed: ' . $connection->connect_error);
    }

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
        $sql = "SELECT `id`, `email` FROM `user` WHERE `username` = '$username'";
        $res = $connection->query($sql);
        $res = $res->fetch_assoc();
        $_SESSION['verify'] = ['name' => $username, 'id' => $res['id'], 'email' => $res['email']];
    } else {
        $answer = ['status' => 'fail', 'message' => 'Name oder E-Mail existiert bereits'];
    }

    $connection->close();
} else {
    $answer = ['status' => 'fail', 'message' => 'errors', 'errors' => $errors];
}
echo json_encode($answer);
