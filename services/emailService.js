const nodemailer = require('nodemailer');
async function sendMail({ from, to, subject, text, html }) {

    // Configuration for SMTP - Simple Mail Transfer Protocol - sendinblue
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    // Sending mail
    let info = await transporter.sendMail({
        // from: from,
        // to: to,
        // subject: subject,
        // text: text,
        // html: html
        // Since the key and values are same we can write it as follows
        from: `FZHare<${from}>`,
        to,
        subject,
        text,
        html
    });
    console.log(info);
}

module.exports = sendMail;