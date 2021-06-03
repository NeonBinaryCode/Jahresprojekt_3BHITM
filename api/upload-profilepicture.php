<?php
session_start();
if (isset($_POST["submit"]) && isset($_FILES["fileToUpload"]) && $_FILES["fileToUpload"]["size"] > 0) {
    if (!isset($_SESSION['user'])) {
        echo json_encode(["status" => "fail", "message" => "Not logged in."]);
        exit;
    }

    // Check if image file is an actual image or fake image
    if (isset($_POST["submit"])) {
        $check = getimageSize($_FILES["fileToUpload"]["tmp_name"]);
        if ($check === false) {
            echo json_encode(["status" => "fail", "message" => "File is not an image."]);
            exit;
        }
    }

    // Check file size
    if ($_FILES["fileToUpload"]["size"] > 5000000) {
        echo json_encode(["status" => "fail", "message" => "File is too large."]);
        exit;
    }

    $tempFile = $_FILES["fileToUpload"]["tmp_name"];

    $imageSize = getimagesize($tempFile);
    $imageWidth = $imageSize[0];
    $imageHeight = $imageSize[1];
    $imageType = $imageSize[2];

    switch ($imageType) {
            // Bedeutung von $imageType:
            // 1 = GIF, 2 = JPG, 3 = PNG, 4 = SWF, 5 = PSD, 6 = BMP, 7 = TIFF(intel byte order), 8 = TIFF(motorola byte order), 9 = JPC, 10 = JP2, 11 = JPX, 12 = JB2, 13 = SWC, 14 = IFF, 15 = WBMP, 16 = XBM
        case 1:
            // GIF
            $image = imagecreatefromgif($tempFile);
            break;
        case 2:
            // JPEG
            $image = imagecreatefromjpeg($tempFile);
            break;
        case 3: // PNG
            $image = imagecreatefrompng($tempFile);
            break;
        default:
            echo json_encode(["status" => "fail", "message" => "Only JPG, GIF and PNG images allowed."]);
            exit;
    }

    // Maximalausmaße
    $maxWidth = 128;
    $maxHeight = 128;

    // Ausmaße kopieren, wir gehen zuerst davon aus, dass das Bild schon Thumbnailgröße hat
    $scaledWidth = $imageWidth;  # 451
    $scaledHeight = $imageHeight; # 805

    $xOff = 0;
    $yOff = 0;

    // Breite skalieren falls nötig
    if ($scaledWidth <= $scaledHeight) {
        $factor = $maxWidth / $scaledWidth;
        $scaledWidth *= $factor;
        $scaledHeight = ceil($scaledHeight * $factor); # 229
        $yOff = floor(($scaledHeight - $maxHeight) / 2); # 50
    } else {
        $factor = $maxHeight / $scaledHeight;
        $scaledWidth = ceil($scaledWidth * $factor);
        $scaledHeight *= $factor;
        $xOff = floor(($scaledWidth - $maxWidth) / 2);
    }

    // Thumbnail erstellen
    $scaledImage = imagecreatetruecolor($maxWidth, $maxHeight);
    imagecopyresampled(
        $scaledImage,
        $image,
        -$xOff,
        -$yOff,
        0,
        0,
        $scaledWidth,
        $scaledHeight,
        $imageWidth,
        $imageHeight
    );

    $db_host = "localhost";
    $db_datenbank = "lensscape";
    $db_username = "lensscape";
    $db_passwort = "lensscape";
    $connection = new mysqli($db_host, $db_username, $db_passwort, $db_datenbank);

    // Check connection
    if ($connection->connect_error) {
        die("connection failed: " . $connection->connect_error);
    }

    $file = md5($_SESSION['user']['username']) . '.png';

    // In Datei speichern
    imagepng($scaledImage, '../media/profilepictures/' . $file);
    imagedestroy($scaledImage);
    imagedestroy($image);

    $sql = "UPDATE `user` SET `profilepicture`='$file' WHERE `id`=" . $_SESSION['user']['id'];
    if ($connection->query($sql)) {
        $sql = "SELECT * FROM lensscape.user WHERE id='" . $_SESSION['user']['id'] . "' AND user_deleted = 0 LIMIT 1";
        if ($res = $connection->query($sql)) {
            if ($res->num_rows > 0) {
                $_SESSION['login'] = 1;
                $_SESSION['user'] = $res->fetch_assoc();
            }
        }
        echo json_encode(["status" => "success", "message" => "Profilepicture updated."]);
    } else {
        echo json_encode(["status" => "fail", "message" => "Couldn't be added to database.", "sql" => $sql]);
    }

    // close database
    $connection->close();
} else {
    echo json_encode(["status" => "fail", "message" => "No file uploaded."]);
}
