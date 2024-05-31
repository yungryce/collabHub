# mail_service.py
import random
import string
from flask_mail import Mail, Message
from flask import current_app

class MailService:
    def __init__(self, mail):
        self.mail = mail
        
    def generate_verification_token(self, length=6):
        if length < 6:
            raise ValueError("Length must be at least 6")

        half_length = length // 2
        extra_digit = length % 2

        letters = ''.join(random.choices(string.ascii_uppercase, k=half_length + extra_digit))
        digits = ''.join(random.choices(string.digits, k=half_length))

        return letters + digits

    def send_email(self, subject, recipients, text_body, html_body):
        if self.mail is None:
            raise Exception("Mail service not initialized")
        
        msg = Message(subject, recipients=recipients)
        msg.body = text_body
        msg.html = html_body
        self.mail.send(msg)
        
    def send_signup_verification(self, recipient, token, ip_address):
        print(f'recipient: {recipient}, token: {token}, ip_address: {ip_address}')
        subject = "CollabHub - Verify Your Email Address"

        # Plain text version
        text_body = f"""
    CollabHub
    Verify your email address

    You need to verify your email address to continue. Enter the following code to verify your email address:

    {token}

    The request for this access originated from IP address {ip_address}

    In case you were not trying to access your CollabHub Account & are seeing this email, please follow the instructions below:

    - Reset your CollabHub password.
    - Check if any changes were made to your account & user settings. If yes, revert them immediately.
    - If you are unable to access your CollabHub Account then contact CollabHub Support.
    """

        # HTML version with increased font size for 'CollabHub' and other texts
        html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
            }}
            .container {{
                max-width: 600px;
                margin: auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }}
            .header {{
                font-size: 28px; /* Increased font size for 'CollabHub' */
                font-weight: bold;
                text-align: center;
                margin-bottom: 20px;
            }}
            .sub-header {{
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
            }}
            .verification-code {{
                font-size: 28px; /* Increased font size for verification code */
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
            }}
            .instructions {{
                margin: 20px 0;
            }}
            .support {{
                color: blue;
                text-decoration: underline;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">CollabHub</div>
            <div class="sub-header">Verify your email address</div>
            <p>You need to verify your email address to continue. Enter the following code to verify your email address:</p>
            <div class="verification-code">{token}</div>
            <p>The request for this access originated from IP address {ip_address}</p>
            <div class="instructions">
                <p>In case you were not trying to access your CollabHub Account & are seeing this email, please follow the instructions below:</p>
                <ul>
                    <li>Reset your CollabHub password.</li>
                    <li>Check if any changes were made to your account & user settings. If yes, revert them immediately.</li>
                    <li>If you are unable to access your CollabHub Account then contact <a href="mailto:support@collabhub.com" class="support">CollabHub Support</a>.</li>
                </ul>
            </div>
        </div>
    </body>
    </html>
    """

        # Send email
        self.send_email(subject, [recipient], text_body, html_body)

    
    def send_new_user_notification(self, recipient):
        subject = "Welcome to Our Service"
        text_body = "Congratulations! Your account has been successfully created."
        html_body = "<p>Congratulations! Your account has been successfully created.</p>"
        self.send_email(subject, [recipient], text_body, html_body)
    
    def send_task_creation_notification(self, recipient, task_name):
        subject = "New Task Created"
        text_body = f"A new task '{task_name}' has been created."
        html_body = f"<p>A new task '<strong>{task_name}</strong>' has been created.</p>"
        self.send_email(subject, [recipient], text_body, html_body)

