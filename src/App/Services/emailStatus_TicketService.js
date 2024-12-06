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
        text: `Mã số vé của bạn là : ${id_Ticket}`,
        html: `
      <div style="font-family: Arial, sans-serif; text-align: center;">
      <div style="text-align: center;" >
      <h1>Welcome, ${email}!</h1>
        <h4>Xác nhận vé thành công!!</h4>
        <h4>Mã số vé của bạn là : ${id_Ticket}</h4>
      </div>
        <div>
        <p>Điểm khởi hành : ${Departure_Location}</p>
        <p>Điểm đến : ${Destination}</p> 
        <p>Ngàykhởi hành : ${Departure_Date}</p>
        <p>giờ khởi hành : ${Departure_Time}</p>
        <p>Tổng Ngày đi : ${Total_DateTrip}</p>
        <p>Giá người lớn : ${Adult_fare}</p>
        <p>Giá Trẻ em : ${Children_fare}</p>
        <p>Người lớn : ${Adult}</p>
        <p>Trẻ em : ${Children}</p>
        <p>Tổng giá : ${Total_price}</p><br>
        <p>Nếu bạn Thắc mắc nào vui lòng liên hệ với email : doantotnghiep24booking@gmail.com </p>
        </div>
        <footer style="margin-top: 20px; color: #777;">
          <p>Booking Travel</p>
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
