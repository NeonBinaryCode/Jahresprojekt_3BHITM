function sendEmail() {
    $.post('../api/send-mail.php', {}, (res) => {
        console.log(res);
    });
}

sendEmail();

$('#send-new').click(sendEmail);
