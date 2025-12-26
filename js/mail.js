function checkFeildIfEmpty(id, placeholder) {
    var value = $(`#${id}`).val();
    if (value.length == 0) {
        $(`#${id}`).addClass('emptyBoxWarning');
        $(`#${id}`).attr('placeholder', placeholder);
    } else {
        $(`#${id}`).removeClass('emptyBoxWarning');
    }
}

function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

function getValue(id) {
    return $(`#${id}`).val();
}

function btnWhenClicked(id, message) {
    $(`#${id}`).text(message);
    $(`#${id}`).attr('disabled', 'true');
}

function btnAfterProcess(id, message) {
    $(`#${id}`).text(message);
    $(`#${id}`).removeAttr('disabled');
}

function displayMessage(message, color) {
    $('#displayId').text(`${message}`).css('color', `${color}`);
}

function sendAjax(url, file) {
    $.ajax({
        type: "POST",
        url: `${url}`,
        data: file,
        cache: false,
        processData: false,
        contentType: false,
        complete: function (data) {
            btnAfterProcess('sendMailId', 'Submit');
            displayMessage(`Information: ${data.responseText}`, 'green')
        }
    });
}

$(document).ready(function () {
    // Get the CKEDITOR Ready
    // CKEDITOR.replace('messageId');

    var link = window.location;
    var url = new URLSearchParams(link.search);
    var key = url.get('businessAdminPersonnelId');

    var fileToUpload = new FormData();

    $('#mailFilePathId').change(function () {
        console.log($(this).prop('files'));
        var a = $(this).prop('files');
        fileToUpload.append('mailFilePathId', a);
    });

    $(window).on('beforeunload', function () {
        var toMail = getValue('toMailId');
        var ccMail = getValue('ccMailId');
        var subjectMail = getValue('mailSubjectId');
        var messageMail = CKEDITOR.instances["messageId"].getData();

        if (messageMail.length > 0 || toMail.length > 0 || ccMail.length > 0
            || subjectMail.length > 0 || messageMail.length > 0) {
            return 'Are you sure you want to leave?';
        }
    });

    $('#sendMailId').click(function () {
        var userMail = getValue('userMailId');
        var userName = getValue('userNameId');
        var subjectMail = getValue('mailSubjectId');
        var messageMail = getValue('messageId');

        checkFeildIfEmpty('userMailId', 'What\'s your email address?');
        checkFeildIfEmpty('userNameId', 'What\'s your name?');
        checkFeildIfEmpty('messageId', 'What message do you intent to send across?');
        checkFeildIfEmpty('mailSubjectId', 'What is the subject of the mail?');


        if (userMail.length > 0 && userName.length > 0
            && subjectMail.length > 0 && messageMail.length > 0 && isValidEmail(userMail)) {
            btnWhenClicked('sendMailId', 'Please wait, Sending Mail...');
            var message = `Name: ${userName} \nEmail: ${userMail}\nMessage: ${messageMail}`;
            fileToUpload.append('mailSubjectId', subjectMail);
            fileToUpload.append('mailToId', 'support@allseasonswindowtint.com');
            fileToUpload.append('mailMessageId', message);
            fileToUpload.append('mailCcId', '');
            fileToUpload.append('userEmailId', userMail);

            for (let [key, value] of fileToUpload) {
                console.log(`${key}: ${value}`)
            }

            sendAjax('./api/noreply_mail.php', fileToUpload);
        } else {
            displayMessage('Information: Fill in the necessary details please', 'red');
        }
    });
});