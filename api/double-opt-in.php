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

$id = $connection->real_escape_string($_GET['id']);

if (strlen($id) == 0) {
    echo "Keine gültige UserID.";
    exit;
}

$sql = "UPDATE `user` SET `opted_in` = '1' WHERE `user`.`id` = $id;";
if ($connection->query($sql)) {
    echo "Registrierung abgeschlossen, Sie können Ihren Account jetzt verwenden.";
} else {
    echo "Bei der Registrierung ist es zu einem Problem gekommen, bitte versuchen Sie es später erneut.";
}
