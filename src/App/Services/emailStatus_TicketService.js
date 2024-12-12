import nodemailer from 'nodemailer'

const sendVerificationEmail = async (email, id_Ticket, Departure_Location, Destination, Departure_Date, Departure_Time, Total_DateTrip, Adult_fare, Children_fare, Adult, Children, Total_price) => {
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
      subject: 'Xác nhận vé thành công',
      text: `Mã số vé của bạn là: ${id_Ticket}`,
      html: `
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
          <tr>
              <td align="center">
                  <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
                      <!-- Header -->
                      <tr>
                          <td align="center" style="background-color: #007bff; color: #ffffff; padding: 20px;">
                              <h1 style="margin: 0; font-size: 28px;">Xác nhận vé thành công</h1>
                          </td>
                      </tr>
                      <!-- Ticket Information -->
                      <tr>
                          <td style="padding: 30px; text-align: left; color: #333;">
                              <p style="font-size: 16px; margin: 0 0 20px;">Chào bạn, <strong>${email}</strong>!</p>
                              <p style="font-size: 16px; margin: 0 0 10px;">Mã số vé của bạn là: <strong>${id_Ticket}</strong></p>
                              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 20px; border-collapse: collapse;">
                                  <tr>
                                      <td style="padding: 10px; font-size: 16px; font-weight: bold; border-bottom: 1px solid #ddd;">Điểm khởi hành:</td>
                                      <td style="padding: 10px; font-size: 16px; border-bottom: 1px solid #ddd;">${Departure_Location}</td>
                                  </tr>
                                  <tr>
                                      <td style="padding: 10px; font-size: 16px; font-weight: bold; border-bottom: 1px solid #ddd;">Điểm đến:</td>
                                      <td style="padding: 10px; font-size: 16px; border-bottom: 1px solid #ddd;">${Destination}</td>
                                  </tr>
                                  <tr>
                                      <td style="padding: 10px; font-size: 16px; font-weight: bold; border-bottom: 1px solid #ddd;">Ngày khởi hành:</td>
                                      <td style="padding: 10px; font-size: 16px; border-bottom: 1px solid #ddd;">${Departure_Date}</td>
                                  </tr>
                                  <tr>
                                      <td style="padding: 10px; font-size: 16px; font-weight: bold; border-bottom: 1px solid #ddd;">Giờ khởi hành:</td>
                                      <td style="padding: 10px; font-size: 16px; border-bottom: 1px solid #ddd;">${Departure_Time}</td>
                                  </tr>
                                  <tr>
                                      <td style="padding: 10px; font-size: 16px; font-weight: bold; border-bottom: 1px solid #ddd;">Tổng ngày đi:</td>
                                      <td style="padding: 10px; font-size: 16px; border-bottom: 1px solid #ddd;">${Total_DateTrip}</td>
                                  </tr>
                                  <tr>
                                      <td style="padding: 10px; font-size: 16px; font-weight: bold; border-bottom: 1px solid #ddd;">Giá người lớn:</td>
                                      <td style="padding: 10px; font-size: 16px; border-bottom: 1px solid #ddd;">${Adult_fare}</td>
                                  </tr>
                                  <tr>
                                      <td style="padding: 10px; font-size: 16px; font-weight: bold; border-bottom: 1px solid #ddd;">Giá trẻ em:</td>
                                      <td style="padding: 10px; font-size: 16px; border-bottom: 1px solid #ddd;">${Children_fare}</td>
                                  </tr>
                                  <tr>
                                      <td style="padding: 10px; font-size: 16px; font-weight: bold; border-bottom: 1px solid #ddd;">Người lớn:</td>
                                      <td style="padding: 10px; font-size: 16px; border-bottom: 1px solid #ddd;">${Adult}</td>
                                  </tr>
                                  <tr>
                                      <td style="padding: 10px; font-size: 16px; font-weight: bold; border-bottom: 1px solid #ddd;">Trẻ em:</td>
                                      <td style="padding: 10px; font-size: 16px; border-bottom: 1px solid #ddd;">${Children}</td>
                                  </tr>
                                  <tr>
                                      <td style="padding: 10px; font-size: 16px; font-weight: bold;">Tổng giá:</td>
                                      <td style="padding: 10px; font-size: 16px; color: #007bff; font-weight: bold;">${Total_price}</td>
                                  </tr>
                              </table>
                              <p style="font-size: 14px; color: #555; margin-top: 20px; text-align: center">Nếu bạn có thắc mắc, vui lòng liên hệ qua email:<br> <strong>doantotnghiep24booking@gmail.com</strong></p>
                          </td>
                      </tr>
                      <!-- Footer -->
                      <tr>
                          <td style="background-color: #f9f9f9; text-align: center; padding: 20px; border-top: 1px solid #ddd; color: #777;">
                                                      <p style="margin: 0; font-size: 14px;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>   
                              <p style="margin: 0; font-size: 14px;">F5 Travel</p>
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