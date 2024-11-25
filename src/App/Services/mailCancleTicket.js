import nodemailer from 'nodemailer'

const sendCancleTicket = async (email, idTicket) => {
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
        from: '"Booking Travel " <doantotnghiep24booking@gmail.com>',
        to: email,
        subject: 'Password Reset Code',
        text: `Your password reset code is: ${idTicket}`,
        html: `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <p>Xin chào ${email}!</p>
        <p>Mã số vé của bạn là ${idTicket}</p>
        <p>Vé của bạn đã được hủy</p>
        <p>Số tiền sẽ được hoàn lại sau vài phút, nếu chưa có xin vui lòng liên hệ đến SDT: 0123456976</p>
        <p>Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu hỗ trợ gì , xin vui lòng liên hệ đến <strong>doantotnghiep24booking@gmail.com</strong> </p>
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

export const emailServiceCancle = {
    sendCancleTicket
}