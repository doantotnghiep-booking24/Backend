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
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
                <tr>
                    <td align="center">
                        <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
                            <!-- Header -->
                            <tr>
                                <td align="center" style="background-color: #007bff; color: #ffffff; padding: 20px;">
                                    <h1 style="margin: 0; font-size: 28px;">Password Reset Code <br> Thay  đổi mật khẩu</h1>
                                </td>
                            </tr>
                            <!-- Main Content -->
                            <tr>
                                <td style="padding: 30px; text-align: center; color: #333;">
                                    <h2 style="font-size: 22px; color: #007bff;">Chào bạn, ${email}!</h2>
                                    <p style="font-size: 16px; margin: 20px 0;">Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. Sử dụng mã bên dưới để đặt lại:</p>
                                    <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 20px auto;">
                                        <tr>
                                            <td style="background-color: #007bff; color: #ffffff; padding: 10px 20px; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
                                                ${code}
                                            </td>
                                        </tr>
                                    </table>
                                    <p style="font-size: 14px; color: #555;">Mã này có hiệu lực trong 15 phút. Nếu bạn không yêu cầu, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ.</p>
                                </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9f9f9; color: #777; text-align: center; padding: 20px; border-top: 1px solid #ddd;">
                                    <p style="margin: 0; font-size: 14px;">Rất vui khi được hỗ trợ bạn</p>
                                    <p style="margin: 0; font-size: 14px;">F5 TRAVEL</p>
                                    <p style="margin-top: 10px; font-size: 12px;">© 2024 f5travel.io.vn</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            `
        };


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
