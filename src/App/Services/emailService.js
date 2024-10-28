import nodemailer from 'nodemailer'

const sendVerificationEmail = async (email, code) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'doantotnghiep24booking@gmail.com',
            pass: "lichlnzxtuiunjli"
        }
    })

    const mailOptions = {
        from: '"DO AN TOT NGHIEP " <doantotnghiep24booking@gmail.com>',
        to: email,
        subject: 'Password Reset Code',
        text: `Your password reset code is: ${code}`,
        html: `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <h1>Welcome, ${email}!</h1>
        <h2>This is Your code : ${code}</h2>
        <p>We're excited to have you on board.</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <footer style="margin-top: 20px; color: #777;">
          <p>Best regards,</p>
          <p>Your Website Team</p>
        </footer>
      </div>
    `
    }


    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId); 
        return info;
    } catch (error) {
        console.error('Error sending email:', error); 
        throw error; 
    }
}

export const emailService = {
    sendVerificationEmail
}