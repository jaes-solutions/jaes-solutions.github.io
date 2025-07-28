<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Ensure you have PHPMailer installed via Composer

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Enable error reporting for debugging
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    // Sanitize inputs
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $message = htmlspecialchars(trim($_POST['message']));

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email format.";
        exit;
    }

    // PHPMailer setup
    $mail = new PHPMailer(true);
    try {
        // SMTP Configuration (Replace with IONOS SMTP details)
        $mail->isSMTP();
        $mail->Host       = 'smtp.ionos.com'; // IONOS SMTP server
        $mail->SMTPAuth   = true;
        $mail->Username   = 'sangeethaluke@jaessolutions.com'; // Your IONOS email
        $mail->Password   = 'Slmslm2508037&'; // Your IONOS email password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 587; 

        // Email Headers
        $mail->setFrom('sangeethaluke@jaessolutions.com', 'JAES Solutions Website');
        $mail->addAddress('sangeethaluke@jaessolutions.com'); 
        $mail->addReplyTo($email, $name);

        // Email Content
        $mail->isHTML(false);
        $mail->Subject = "New Contact Form Submission to JAES Solutions";
        $mail->Body    = "Name: $name\nEmail: $email\n\nMessage:\n$message";

        // Send Email
        if ($mail->send()) {
            echo "<script>alert('Thank you for your message. We will get back to you shortly.'); window.location.href = 'contact.html';</script>";
        } else {
            echo "<script>alert('Error: " . $mail->ErrorInfo . "');</script>";
        }
        
    } catch (Exception $e) {
        echo "Mailer Error: " . $mail->ErrorInfo;
    }
} else {
    echo "Invalid request method.";
}
?>
