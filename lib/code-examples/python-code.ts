export const pythonCode = `import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# 1. Load the HTML template
with open('your-template.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# 2. Replace variables
html_content = html_content.replace('{{recipient_name}}', 'Alex')
html_content = html_content.replace('{{otp_code}}', '123456')

# 3. Set up the email message
sender_email = "your-email@example.com"
receiver_email = "recipient@email.com"
password = "your-password"

message = MIMEMultipart("alternative")
message["Subject"] = "Your One-Time Password"
message["From"] = sender_email
message["To"] = receiver_email
message.attach(MIMEText(html_content, "html"))

# 4. Send the email
try:
    with smtplib.SMTP("smtp.example.com", 587) as server:
        server.starttls()
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())
        print("Email sent successfully!")
except Exception as e:
    print(f"Error sending email: {e}")`;