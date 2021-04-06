<?php
session_start();

$user = isset($_SESSION['user']) ? $_SESSION['user']['username'] : '';

if (strlen($user) > 0) {
    $res = ['status' => 'success', 'email' => $_SESSION['user']['email'], 'username' => $user];
    $sql = "SELECT *  FROM `reservation` WHERE `userid`=" .  $_SESSION['user']['id'];
} else {
    $res = ['status' => 'fail', 'message' => 'Nicht angemeldet'];
}

echo json_encode($res);
