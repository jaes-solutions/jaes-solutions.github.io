<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize input data
    $name = htmlspecialchars(trim($_POST["name"]));
    $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST["phone"]));
    $position = htmlspecialchars(trim($_POST["position"]));
    $message = !empty($_POST["message"]) ? htmlspecialchars(trim($_POST["message"])) : "No cover letter provided.";

    // Validate required fields
    if (empty($name) || empty($email) || empty($phone) || empty($position)) {
        die("All required fields must be filled.");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Invalid email format.");
    }

    // Handle file upload
    $uploadDir = "uploads/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $resume = $_FILES["resume"];
    $allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    $fileType = mime_content_type($resume["tmp_name"]);
    $fileName = basename($resume["name"]);
    $targetFilePath = $uploadDir . time() . "_" . $fileName;

    if (!in_array($fileType, $allowedTypes)) {
        die("Invalid file format. Only PDF, DOC, and DOCX allowed.");
    }

    if ($resume["size"] > 5 * 1024 * 1024) { // 5MB max file size
        die("File size exceeds 5MB limit.");
    }

    if (!move_uploaded_file($resume["tmp_name"], $targetFilePath)) {
        die("Failed to upload resume.");
    }

    // Send email using PHPMailer
    $mail = new PHPMailer(true);
    try {
        // SMTP settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';  // Use Gmail's SMTP server
        $mail->SMTPAuth = true;
        $mail->Username = 'sangeethaluke@gmail.com'; // Your Gmail address
        $mail->Password = 'gvab dupg bkch bfcw'; // Use an App Password, NOT your Gmail password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Email settings
        $mail->setFrom($email, $name);
        $mail->addAddress('sangeethaluke@gmail.com', 'HR Department');
        $mail->addReplyTo($email, $name);
        
        // Attach the resume
        $mail->addAttachment($targetFilePath);

        // Email content
        $mail->isHTML(true);
        $mail->Subject = "New Job Application - $position";
        $mail->Body = "
            <html>
            <body>
                <h2>New Job Application</h2>
                <p><strong>Name:</strong> $name</p>
                <p><strong>Email:</strong> $email</p>
                <p><strong>Phone:</strong> $phone</p>
                <p><strong>Position Applied For:</strong> $position</p>
                <p><strong>Cover Letter:</strong></p>
                <p>$message</p>
                <p><strong>Resume:</strong> Attached</p>
            </body>
            </html>";

        if ($mail->send()) {
            echo "Application submitted successfully!";
        } else {
            die("Application submitted but failed to send email.");
        }
    } catch (Exception $e) {
        die("Error: " . $mail->ErrorInfo);
    }
} else {
    die("Invalid request.");
}
?>
