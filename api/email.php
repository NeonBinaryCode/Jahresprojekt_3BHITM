<?php
$empfaenger = 'ettinger.fabian@gmail.com';
$betreff = 'Test123';
$nachricht = 'Hallo Welt';
$header = array(
    'From' => 'no-reply@lensscape.com',
    'X-Mailer' => 'PHP/' . phpversion()
);

mail($empfaenger, $betreff, $nachricht);
?>
