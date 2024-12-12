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
        subject: 'Thông Báo Hủy Vé',
        text: `Mã số vé của bạn là: ${idTicket}`,
        html: `
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
            <tr>
                <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
                        <!-- Header -->
                        <tr>
                            <td align="center" style="background-color: #ff4d4f; color: #ffffff; padding: 20px;">
                                <h1 style="margin: 0; font-size: 28px;">Thông Báo Hủy Vé</h1>
                            </td>
                        </tr>
                        <!-- Main Content -->
                        <tr>
                            <td style="padding: 30px; text-align: left; color: #333;">
                                <p style="font-size: 16px; line-height: 1.6;">Xin chào <strong>${email}</strong>,</p>
                                <p style="font-size: 16px; line-height: 1.6;">Chúng tôi xin thông báo rằng vé của bạn đã được hủy thành công.</p>
                                <p style="font-size: 16px; line-height: 1.6;">Mã số vé của bạn là: <strong>${idTicket}</strong></p>
                                <p style="font-size: 16px; line-height: 1.6;">Số tiền sẽ được hoàn lại trong vài phút. Nếu chưa nhận được, xin vui lòng liên hệ với chúng tôi qua số điện thoại: <strong>0123456976</strong>.</p>
                                <p style="font-size: 16px; line-height: 1.6;">Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu hỗ trợ nào, vui lòng liên hệ qua email: <strong>doantotnghiep24booking@gmail.com</strong>.</p>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f9f9f9; color: #777; text-align: center; padding: 20px; border-top: 1px solid #ddd;">
                                <p style="margin: 0; font-size: 14px;">F5 rất vui khi được phục vụ bạn! Mong rằng bạn có thể sớm quay lại F5 Travel chúng tôi!</p>
                                <p style="margin: 0; font-size: 14px; font-weight: bold;">Chúc bạn và gia đình có một ngày tốt lành!</p>
                                <p style="margin-top: 10px; font-size: 12px;">© 2024 F5Travel - f5travel.io.vn</p>
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

export const emailServiceCancle = {
    sendCancleTicket
}