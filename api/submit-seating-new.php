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
    $id = isset($_POST['id']) ? $connection->real_escape_string($_POST['id']) : -1;
    $row = isset($_POST['row']) ? $connection->real_escape_string($_POST['row']) : -1;
    $cols = isset($_POST['cols']) ? $_POST['cols'] : [];

    $sql = "SELECT `seats` FROM `showing` WHERE `id`=$id";
    if ($res = $connection->query($sql)) {
        $arr = json_decode($res->fetch_assoc()['seats']);
        $res->close();
        $valid = true;
        foreach ($cols as $col) {
            if ($arr[$row][$col] != 0) {
                $answer = ['status' => 'fail', 'message' => 'Seats already selected'];
                $valid = false;
                break;
            }
        }
        if ($valid) {
            if ($row < 0 || $row > count($arr)) {
                $answer = ['status' => 'fail', 'message' => 'Invalid row'];
                $connection->close();
                echo json_encode($answer);
                exit;
            }
            foreach ($cols as $col) {
                if ($col < 0 || $col > count($arr[$row])) {
                    $answer = ['status' => 'fail', 'message' => 'Invalid columns'];
                    $connection->close();
                    echo json_encode($answer);
                    exit;
                }
                $arr[$row][$col] = 1;
            }
            $arr = json_encode($arr);
            $sql = "UPDATE `showing` SET `seats`='$arr' WHERE `id`=$id";
            if ($connection->query($sql)) {
                $cols = json_encode($cols);
                $sql = "INSERT INTO `reservation`(`userid`, `showingid`, `row`, `cols`) VALUES ($user,$id,$row,'$cols')";
                if ($res2 = $connection->query($sql)) {
                    $answer = ['status' => 'success', 'message' => 'Reserved seats'];
                } else {
                    $answer = ['status' => 'fail', 'message' => 'Invalid values', 'sql' => $sql, 'res' => $res2];
                }
            } else {
                $answer = ['status' => 'fail', 'message' => 'Invalid values', 'sql' => $sql];
            }
        }
    } else {
        $answer = ['status' => 'fail', 'message' => 'Invalid showing id'];
    }
} else {
    $answer = ['status' => 'fail', 'message' => 'Not logged in'];
}

$connection->close();
echo json_encode($answer);
