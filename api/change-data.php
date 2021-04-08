<?php

require 'regex.php';

$db_host = 'localhost';
$db_name = 'lensscape';
$db_username = 'lensscape';
$db_password = 'lensscape';

session_start();
$connection = new mysqli($db_host, $db_username, $db_password, $db_name);

if ($connection->connect_error) {
    die('Database connection failed: ' . $connection->connect_error);
}

$id = isset($_SESSION['user']) ? $_SESSION['user']['id'] : -1;

if ($id == -1) {
    $answer = ['status' => 'fail', 'message' => 'Nicht angemeldet'];
} else {
    $username = isset($_POST['username']) ? $connection->real_escape_string($_POST['username']) : '';
    $email = isset($_POST['email']) ? $connection->real_escape_string($_POST['email']) : '';

    if (preg_match(usernameRegex, $username)) {
        if ($connection->query("SELECT * FROM `user` WHERE `username`='$username'")->num_rows > 0) {
            $exit = true;
        } else {
            $sql = "UPDATE `user` SET `username`='$username' WHERE `id`=$id";
        }
    } else if (preg_match(emailRegex, $email)) {
        if ($connection->query("SELECT * FROM `user` WHERE `email`='$email'")->num_rows > 0) {
            $exit = true;
        } else {
            $sql = "UPDATE `user` SET `email`='$email' WHERE `id`=$id";
        }
    } else {
        $exit = true;
    }

    if (!($exit ?? false) && $connection->query($sql)) {
        $sql = "SELECT * FROM lensscape.user WHERE id='$id' AND user_deleted = 0 LIMIT 1";
        if ($res = $connection->query($sql)) {
            if ($res->num_rows > 0) {
                $_SESSION['login'] = 1;
                $_SESSION['user'] = $res->fetch_assoc();
            } else {
                $answer = ['status' => 'fail', 'message' => 'Falsche Login-Daten'];
            }
            $res->close();
        }
        $answer = ['status' => 'success', 'message' => 'Daten geändert'];
    } else if ($exit ?? false) {
        $answer = ['status' => 'fail', 'message' => 'Existiert bereits'];
    } else {
        $answer = ['status' => 'fail', 'message' => 'Ungültige Daten'];
    }
}
$connection->close();

echo json_encode($answer);
