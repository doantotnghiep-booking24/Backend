import Connection from '../../Config/db/index.js'
import { ObjectId } from 'mongodb'
import Ticket from '../Models/Ticket.js'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import moment from 'moment'
import qs from 'qs'
const config = {
    app_id: "2553",
    key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};
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
    async Payment(req, res, next) {
        const embed_data = {
            redirecturl: 'http://pcrender.com'
        };
        const { id_Schedule_Travel, id_Voucher, id_Category, id_Type_Tour, Name_Tour, Price_Tour, After_Discount, Image_Tour, Title_Tour, Description_Tour, Start_Tour, End_Tour, total_Date } = req.body
        const tours = [{
            id_Schedule_Travel,
            id_Voucher,
            id_Category,
            id_Type_Tour,
            Name_Tour,
            Price_Tour,
            After_Discount,
            Image_Tour,
            Title_Tour,
            Description_Tour,
            Start_Tour,
            End_Tour,
            total_Date
        }];
        const transID = Math.floor(Math.random() * 1000000);
        const ticket = {
            app_id: config.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
            app_user: "Nguyễn Ngọc Hùng",
            app_time: Date.now(), // miliseconds
            item: JSON.stringify(tours),
            embed_data: JSON.stringify(embed_data),
            amount: Price_Tour,
            description: `Lazada - Payment for the ticket #${transID}`,
            title : 'Thông tin Tour',
            bank_code: "",
            callback_url: 'https://143f-116-110-8-73.ngrok-free.app/Ticket/Callback'
        };

        // appid|app_trans_id|appuser|amount|apptime|embeddata|item
        const data = config.app_id + "|" + ticket.app_trans_id + "|" + ticket.app_user + "|" + ticket.amount + "|" + ticket.app_time + "|" + ticket.embed_data + "|" + ticket.item;
        ticket.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
console.log(data);

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
                console.log('dataJson',dataJson);
                
                console.log("update ticket's status = success where app_trans_id =", dataJson["app_trans_id"]);

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
           return res.status(200).send({result : result.data})
            //    return res.status(200).send({result : JSON.stringify(result.data)})
        } catch (error) {
            console.log(error);

        }
    }
    CreateTicket(req, res, next) {
        //   const { Name_Ticket } = req.body
        //   Connection.connect().then(async (db) => {
        //      try {
        //         const CheckTicket = await Ticket.FindTicket(db, Name_Ticket)
        //         if (!CheckTicket) {
        //            const Create = new Ticket(undefined, Name_Ticket)
        //            const result = await Create.CreateTicket(db)
        //            if (result) return res.status(200).send({ message: 'Created Success' })
        //         } else {
        //            return res.status(400).send({ message: 'Ticket is already exist' })
        //         }
        //      } catch (error) {
        //         console.log(error);
        //      }
        //   })
    }
    //    UpdateTicket(req, res, next) {
    //       const { id } = req.params
    //       const { Name_Ticket } = req.body
    //       Connection.connect().then(async (db) => {
    //          try {
    //             const Update = new Ticket(undefined, Name_Ticket)
    //             const result = await Update.UpdateTicket(db, new ObjectId(id))
    //             if (result) return res.status(200).send({ message: 'Updated Success' })
    //          } catch (error) {
    //             console.log(error);
    //          }
    //       })
    //    }
    //    DeleteTicket(req, res, next) {
    //       const { id } = req.params
    //       Connection.connect().then(async (db) => {
    //          try {
    //             const Delete = Ticket.DeleteTicket(db, new ObjectId(id))
    //             if (Delete) return res.status(200).send({ message: 'Deleted Success' })
    //          } catch (error) {
    //             console.log(error);
    //          }
    //       })
    //    }
}
export default new Ticket_Controller()