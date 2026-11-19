"""Minimal SMTP email sender (used for password resets).

Configure with SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, MAIL_FROM.
Works with Gmail (app password), Brevo, Mailgun, Resend SMTP, etc.
"""
import smtplib
import ssl
from email.message import EmailMessage

from flask import current_app


def send_email(to, subject, text):
    cfg = current_app.config
    if not cfg.get("SMTP_HOST") or not cfg.get("MAIL_FROM"):
        current_app.logger.warning("mail.not_configured subject=%r", subject)
        return False

    msg = EmailMessage()
    msg["From"] = cfg["MAIL_FROM"]
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(text)

    try:
        port = int(cfg.get("SMTP_PORT", 587))
        if port == 465:
            server = smtplib.SMTP_SSL(cfg["SMTP_HOST"], port, timeout=15,
                                      context=ssl.create_default_context())
        else:
            server = smtplib.SMTP(cfg["SMTP_HOST"], port, timeout=15)
            server.starttls(context=ssl.create_default_context())
        with server:
            if cfg.get("SMTP_USERNAME"):
                server.login(cfg["SMTP_USERNAME"], cfg["SMTP_PASSWORD"])
            server.send_message(msg)
        current_app.logger.info("mail.sent subject=%r", subject)
        return True
    except Exception:
        current_app.logger.exception("mail.send_failed subject=%r", subject)
        return False
