import Connection from '../../Config/db/index.js'
import { ObjectId } from 'mongodb'
import Ticket from '../Models/Ticket.js'
import Custommers from '../Models/Custommers.js'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import crypto from 'crypto'
import moment from 'moment'
import qs from 'qs'
import QueryString from 'qs'
import dateFormat from 'dateformat'
const config = {
    app_id: "2553",
    key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};
let id_Custommer
class Ticket_Controller {
    GetAllTicket(req, res, next) {
        //   Connection.connect().then(async (db) => {
        //      try {
        //         const GetTickets = await Ticket.GetTicket(db)
        //         if (GetTickets) return res.status(200).send({ Tickets: GetTickets })
        //      } catch (error) {
        //         console.log(error);
        //      }
        //   })
    }
    async PaymentWithZalopay(req, res, next) {
        const embed_data = {
            redirecturl: 'http://localhost:5173/booking-history'
        };
        const { total_Price, Destination, Title_Tour, Departure_Date, Departure_Time, Total_DateTrip, Adult_fare, Children_fare, Adult, Total_price, id_tour, id_user, id_Service, id_Voucher, id_Ticket, Create_by, Name_Custommer, Date_Of_Birth, Sex_Custommer, Phone_Number, Citizen_Identification, Address } = req.body
        const Ticket_tour = [{
            id_Ticket,
            total_Price,
            Destination,
            Title_Tour,
            Departure_Date,
            Departure_Time,
            Total_DateTrip,
            Adult_fare,
            Children_fare,
            Adult,
            Total_price,
            id_tour,
            id_user,
            id_Service,
            id_Voucher
        }];

        const Custommer = {
            Create_by,
            Name_Custommer,
            Date_Of_Birth,
            Sex_Custommer,
            Phone_Number,
            Citizen_Identification,
            Address
        }
        console.log(Name_Custommer);

        Connection.connect().then(async (db) => {
            const Info_Custommers = await new Custommers(undefined, Custommer.Create_by = Ticket_tour[0].id_user, Custommer.Name_Custommer, Custommer.Date_Of_Birth, Custommer.Sex_Custommer, Custommer.Phone_Number, Custommer.Citizen_Identification, Custommer.Address)
            const Result_Custommer = await Info_Custommers.Create(db)
            id_Custommer = Result_Custommer.insertedId
        })
        // console.log('Custommer',Custommer);
        // console.log('Ticket_ID',Ticket_ID);
        // console.log('tours',tours);
        const transID = Math.floor(Math.random() * 1000000);
        const ticket = {
            app_id: config.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
            app_user: 'Nguyễn Ngọc Hùng',
            app_time: Date.now(), // miliseconds
            item: JSON.stringify(Ticket_tour),
            embed_data: JSON.stringify(embed_data),
            amount: Total_price,
            description: `Zalo - Payment for the ticket #${transID}`,
            title: 'Thông tin Tour',
            bank_code: "",
            callback_url: 'https://005a-116-105-208-12.ngrok-free.app/Ticket/Callback'
        };

        // appid|app_trans_id|appuser|amount|apptime|embeddata|item
        const data = config.app_id + "|" + ticket.app_trans_id + "|" + ticket.app_user + "|" + ticket.amount + "|" + ticket.app_time + "|" + ticket.embed_data + "|" + ticket.item;
        ticket.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
        // console.log(data);

        try {
            const result = await axios.post(config.endpoint, null, { params: ticket })
            res.status(200).send({ Message: result.data })

        } catch (error) {
            console.log(error);
        }
    }
    Callback(req, res, next) {
        let result = {};

        try {
            let dataStr = req.body.data;
            let reqMac = req.body.mac;

            let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
            console.log("mac =", mac);


            // kiểm tra callback hợp lệ (đến từ ZaloPay server)
            if (reqMac !== mac) {
                // callback không hợp lệ
                result.return_code = -1;
                result.return_message = "mac not equal";
            }
            else {
                // thanh toán thành công
                // merchant cập nhật trạng thái cho đơn hàng
                let dataJson = JSON.parse(dataStr, config.key2);
                console.log('dataJson', dataJson);

                console.log("update ticket's status = success where app_trans_id =", dataJson["app_trans_id"]);
                const data = JSON.parse(dataJson.item)
                const id_Ticket = data[0].id_Ticket
                // console.log(data[0]);

                Connection.connect().then(async (db) => {
                    if (id_Custommer) {
                        const result_status = await Ticket.UpdateTicket(db, new ObjectId(id_Ticket), id_Custommer, 'Đã Thanh Toán', 'Payment with Zalopay')
                        console.log(result_status);
                    }

                })
                result.return_code = 1;
                result.return_message = "success";
            }
        } catch (ex) {
            result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
            result.return_message = ex.message;
        }

        // thông báo kết quả cho ZaloPay server
        res.json(result);
    }
    async TicketStatus(req, res, next) {
        const { app_trans_id } = req.params
        let postData = {
            app_id: config.app_id,
            app_trans_id: app_trans_id, // Input your app_trans_id
        }

        let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
        postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();


        let postConfig = {
            method: 'post',
            url: 'https://sb-openapi.zalopay.vn/v2/query',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(postData)
        };

        try {
            const result = await axios(postConfig)
            return res.status(200).send({ result: result.data })
            //    return res.status(200).send({result : JSON.stringify(result.data)})
        } catch (error) {
            console.log(error);

        }
    }
    CreateTicket(req, res, next) {
        let { Departure_Location, Destination, Title_Tour, Departure_Date, Departure_Time, Total_DateTrip, Adult_fare, Children_fare, Adult, Children, Total_price, id_tour, id_user, id_Service, id_Custommer, id_Voucher, Created_at_Booking, Status_Payment, Payment_Method } = req.body
        Connection.connect().then(async (db) => {
            try {
                const Create = new Ticket(undefined, Departure_Location, Destination, Title_Tour, Departure_Date, Departure_Time, Total_DateTrip, Adult_fare, Children_fare, Adult, Children, Total_price, id_tour, id_user, id_Service, id_Custommer, id_Voucher, Created_at_Booking, Status_Payment, Payment_Method = null)
                const result = await Create.CreateTicket(db)
                if (result) {
                    return res.status(200).send({ message: 'Created Success', ticKetId: result })
                }
            } catch (error) {
                console.log(error);
            }
        })
    }
    FindTicket(req, res, next) {
        let { id } = req.params
        Connection.connect().then(async (db) => {
            try {
                const result = await Ticket.FindTicket(db, new ObjectId(id))
                if (result) {
                    return res.status(200).send({ message: 'Find Success', Ticket: result.result_Find })
                } else {
                    return res.status(404).send({ message: 'Not founded ticket', Ticket: result })
                }

            } catch (error) {
                console.log(error);
            }
        })
    }



    create_payment_url(req, res, next) {
        const reqs = req.body
        console.log(reqs.Name_Custommer);

        let Create_by
        Connection.connect().then(async (db) => {
            const Info_Custommers = await new Custommers(undefined, Create_by = reqs.id_user, reqs.Name_Custommer, reqs.Date_Of_Birth, reqs.Sex_Custommer, reqs.Phone_Number, reqs.Citizen_Identification, reqs.Address)
            const Result_Custommer = await Info_Custommers.Create(db)
            id_Custommer = Result_Custommer.insertedId
        })
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');

        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;


        let tmnCode = 'K0OW2EW2'
        let secretKey = 'E3CXY1RMHAWX42E8EKJZRPUPTPX8O31M'
        let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
        let returnUrl = 'http://localhost:3001/Ticket/vnpay_return'

        let orderId = req.body.ticket_id
        let amount = req.body.amount;
        let bankCode = req.body.bankCode;

        let locale = req.body.language;
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);
        if (vnp_Params) {
            // console.log(vnp_Params);

            var signData = QueryString.stringify(vnp_Params, { encode: false });
            // console.log(signData);
        }

        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + QueryString.stringify(vnp_Params, { encode: false });
        // console.log(vnpUrl);
        // res.send(vnpUrl)
        // res.redirect(vnpUrl)
        res.send(vnpUrl)
        function sortObject(obj) {
            let sorted = {};
            let str = [];
            let key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    str.push(encodeURIComponent(key));
                }
            }
            str.sort();
            for (key = 0; key < str.length; key++) {
                sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
            }

            return sorted;
        }
    }
    vnpay_return(req, res, next) {

        let vnp_Params = req.query;

        let secureHash = vnp_Params["vnp_SecureHash"];

        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        vnp_Params = sortObject(vnp_Params);

        let tmnCode = 'K0OW2EW2'
        let secretKey = 'E3CXY1RMHAWX42E8EKJZRPUPTPX8O31M'

        let signData = QueryString.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

        if (secureHash === signed) {
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
            const Ticket_id = vnp_Params['vnp_TxnRef']
            Connection.connect().then(async (db) => {
                if (id_Custommer) {
                    const result_status = await Ticket.UpdateTicket(db, new ObjectId(Ticket_id), id_Custommer, 'Đã Thanh Toán', 'Payment with Vnpay')
                    console.log(result_status);
                }

            })
            console.log('true');
            res.render('Ticket');
        } else {
            console.log('false');

        }
        function sortObject(obj) {
            let sorted = {};
            let str = [];
            let key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    str.push(encodeURIComponent(key));
                }
            }
            str.sort();
            for (key = 0; key < str.length; key++) {
                sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
            }

            return sorted;
        }
    }
    async MomoPayment(req, res, next) {
        //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
        //parameters
        let accessKey = 'F8BBA842ECF85';
        let secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        let orderInfo = 'pay with MoMo';
        let partnerCode = 'MOMO';
        let redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
        let ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
        let requestType = "payWithMethod";
        let amount = '50000';
        let orderId = partnerCode + new Date().getTime();
        let requestId = orderId;
        let extraData = '';
        let orderGroupId = '';
        let autoCapture = true;
        let lang = 'vi';

        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        let rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
        //puts raw signature
        console.log("--------------------RAW SIGNATURE----------------")
        console.log(rawSignature)
        //signature

        let signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
        console.log("--------------------SIGNATURE----------------")
        console.log(signature)

        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature
        });
        //Create the HTTPS objects
        const Options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
            data: requestBody,
        }
        let result
        try {
            result = await axios(Options)
            return res.status(200).json(result.data)
        } catch (error) {
            return res.status(500).json({ Message: 'Lỗi server' })

        }
        //Send the request and get the response

    }
    Direct_PaymentTicket(req, res, next) {
        const { ticket_id, id_tour, id_user, id_Service, id_Voucher, Name_Custommer, Date_Of_Birth, Sex_Custommer, Phone_Number, Citizen_Identification, Address } = req.body
        let Create_by
        Connection.connect().then(async (db) => {
            const Info_Custommers = new Custommers(undefined, Create_by = id_user, Name_Custommer, Date_Of_Birth, Sex_Custommer, Phone_Number, Citizen_Identification, Address)
            const Result_Custommer = await Info_Custommers.Create(db)
            id_Custommer = Result_Custommer.insertedId
        })
        if (id_Custommer) {
            Connection.connect().then(async (db) => {
                const res_upDirect = await Ticket.UpdateDirctTicket(db, new ObjectId(ticket_id), id_Custommer, 'Chưa thanh toán', 'Thanh toán trực tiếp')
                if (res_upDirect) {
                    return res.status(200).json({ Message: 'Đặt vé thành công' })
                } else {
                    return res.status(400).json({ Error: 'Đặt vé không thành công' })
                }
            })
            
        }
    }
}
export default new Ticket_Controller()