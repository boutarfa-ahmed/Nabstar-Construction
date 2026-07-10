<?php
require_once __DIR__ . '/../api/db.php';
require_once __DIR__ . '/../api/helpers.php';
require_once __DIR__ . '/../vendor/autoload.php'; // ✅ charge PHPMailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    setHeaders();
    try {
        $pdo = getPDO();

        $required = ['firstName', 'lastName', 'email', 'phoneNumber', 'message'];
        foreach ($required as $field) {
            if (empty($_POST[$field])) {
                echo json_encode([
                    'success' => false,
                    'error' => "Missing field: $field"
                ]);
                exit;
            }
        }

        $fullName = trim($_POST['firstName'] . ' ' . $_POST['lastName']);
        $email       = trim($_POST['email']);
        $phoneNumber = trim($_POST['phoneNumber']);
        $message     = trim($_POST['message']);

        // ✅ Enregistrer dans la base
        $stmt = $pdo->prepare("
            INSERT INTO contacts (name, email, phone, message)
            VALUES (:fullName, :email, :phoneNumber, :message)
        ");
        $stmt->execute([
            ':fullName'   => $fullName,
            ':email'       => $email,
            ':phoneNumber' => $phoneNumber,
            ':message'     => $message
        ]);

        // ✅ Envoyer un e-mail avec PHPMailer
        $mail = new PHPMailer(true);
        try {
            // Configuration du serveur SMTP
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com'; // ou smtp.yourdomain.com
            $mail->SMTPAuth   = true;
    $mail->Username   = 'demo@example.com';
    $mail->Password   = 'your-smtp-password';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            // Expéditeur et destinataire
            $mail->setFrom($email, $fullName);
            $mail->addAddress('demo@example.com', 'Nabstar Construction');

            // Contenu
            $mail->isHTML(true);
            $mail->Subject = "📩 New contact message from $fullName";
            $mail->Body    = "
                <h2>New Contact Message</h2>
                <p><strong>Name:</strong> $fullName</p>
                <p><strong>Email:</strong> $email</p>
                <p><strong>Phone:</strong> $phoneNumber</p>
                <p><strong>Message:</strong></p>
                <p>$message</p>
            ";

            $mail->send();

            echo json_encode([
                'success' => true,
                'message' => 'Message sent successfully ✅'
            ]);
        } catch (Exception $e) {
            error_log("Mail error: " . $mail->ErrorInfo);
            echo json_encode([
                'success' => false,
                'error' => 'Database saved but email not sent ❌'
            ]);
        }

        exit;

    } catch (Exception $e) {
        error_log("Insert error: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'error' => 'Something went wrong'
        ]);
        exit;
    }
}
?>



<section class="contact animate-on-scroll" id="contact">
    <div class="rule animate-on-scroll"></div>
    <div class="section__padding">
    <div class="contact-header animate-on-scroll">
        <h4 class="contact__title all__title animate-on-scroll">Contact Us</h4>
        <h2 class="contact__headline all__headline animate-on-scroll">Let’s Turn Your Idea<br><span class="accent-color">Into Reality</span></h2>
        <p class="contact__subtitle all__subtitle animate-on-scroll">Whether it’s a small repair or a custom project, we’re here to help. Contact us today and let’s make it happen.</p>
    </div>

    <div id="contactContainer" class="contact-content animate-on-scroll">
        <div class="contact__form animate-on-scroll">
            <form id="contactForm" action="includes/contact.php" method="POST">
                <fieldset class="form__fullName">
                    <label>
                        <span>First Name *</span>
                        <input placeholder="Ex. John" type="text" name="firstName" required>
                    </label>
                    <label>
                        <span>Last Name *</span>
                        <input placeholder="Ex. Doe" type="text" name="lastName" required>
                    </label>
                </fieldset>

                <fieldset class="form__contact">
                    <label>
                        <span>Email *</span>
                        <input placeholder="example@email.com" type="email" name="email" required>
                    </label>
                    <label>
                        <span>Phone Number *</span>
                        <input placeholder="Enter Phone Number" type="tel" name="phoneNumber" required>
                    </label>
                </fieldset>

                <div class="form__message">
                    <label>
                        <span>Your Message *</span>
                        <textarea placeholder="Enter here.." name="message" rows="5" required></textarea>
                    </label>
                </div>

                <button class="btn btn-accent" type="submit" id="submitForm">Send Message</button>
            </form>
            <div id="formResponse" style="margin-top:10px;color:green;"></div>
        </div>

        <div class="contact__info animate-on-scroll">
            <div class="degradation"></div>
            <address>
                <div class="location__info">
                    <h3>Location</h3>
                    <p><a class="contact-link" href="https://maps.google.com/?q=Watford,+United+Kingdom" target="_blank">Watford, United Kingdom</a></p>
                </div>

                <div class="contact__details">
                    <h3>Contact</h3>
                    <p><a class="contact-link" href="tel:+1 (555) 123-4567">Phone : +1 (555) 123-4567</a></p>
                    <p><a class="contact-link" href="mailto:demo@example.com">Email : demo@example.com</a></p>
                </div>
            </address>

            <div class="open__time">
                <h3>Open Time</h3>
                <p>We are open 24/7</p>
            </div>

            <div class="connect__area__div">
                <h3>Stay Connected</h3>
                <div class="connect__area">
                    <a class="icon__bg__accent" href="https://www.facebook.com/nabstarconstruction/photos?locale=en_GB&checkpoint_src=any" aria-label="Facebook Profile" target="_blank" rel="noopener noreferrer"> <i class="fab fa-facebook-f"></i> </a>
                    <a class="icon__bg__accent" href="https://api.whatsapp.com/send/?phone=15551234567&text=Hello+Nabstar+Construction%2C+I+would+like+to+get+a+quote+please.&type=phone_number&app_absent=0" aria-label="WhatsApp Profile" target="_blank" rel="noopener noreferrer"> <i class="fab fa-whatsapp"></i> </a> 
                    <a class="icon__bg__accent" href="mailto:demo@example.com" aria-label="Send an email"> <i class="fas fa-envelope"></i> </a> 
                    <a class="icon__bg__accent" href="https://maps.google.com/?q=Watford,+United+Kingdom" aria-label="Find us on a map" target="_blank" rel="noopener noreferrer"> <i class="fas fa-map-marker-alt"></i> </a> 
                </div>
            </div>
            <div class="degradation"></div>
        </div>
    </div>

    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d79197.33912864063!2d-0.40550974999999995!3d51.661358799999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487614c908fcc35b%3A0x5d521bb3eb9734f1!2sWatford%2C%20UK!5e0!3m2!1sen!2stn!4v1758590443121!5m2!1sen!2stn" width="100%" height="400" style="border:0; border-radius: 18px; margin-top: 20px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <div class="rule animate-on-scroll"></div>
</section>