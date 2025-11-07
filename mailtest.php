<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Ensure PHPMailer is installed via Composer

$mail = new PHPMailer(true);

try {
    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host       = 'smtp.ionos.com'; // Change if needed
    $mail->SMTPAuth   = true;
    $mail->Username   = 'sangeethaluke@jaessolutions.com'; // Your IONOS email
    $mail->Password   = 'Slmslm2508037&'; // Your IONOS email password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Use SSL
    $mail->Port       = 587; // Use 465 for SSL or 587 for TLS

    // Email Headers
    $mail->setFrom('sangeethaluke@jaessolutions.com', 'Test Mail');
    $mail->addAddress('sangeethaluke@jaessolutions.com'); // Change to your recipient email

    // Email Content
    $mail->isHTML(true);
    $mail->Subject = 'PHPMailer Test Email';
    $mail->Body    = 'This is a test email from your website using PHPMailer.';

    // Send Email
    if ($mail->send()) {
        echo "Mail Sent Successfully!";
    } else {
        echo "Mailer Error: " . $mail->ErrorInfo;
    }
} catch (Exception $e) {
    echo "Error: " . $mail->ErrorInfo;
}
?>
