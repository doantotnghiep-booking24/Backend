import express from 'express'
import cookieParser from 'cookie-parser'; // import cookie-parser to use req.cookies
import cors from 'cors'
import Route from './Routes/index.js';
import Connection from './Config/db/index.js'
import { ObjectId } from 'mongodb';
import moment from 'moment';
import { engine } from 'express-handlebars';
import setupSocket from './socket.js';
import { createServer } from 'http';
import { corsOptions } from './Config/cors.js';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors(corsOptions))
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // use cookie-parser to read cookies

app.engine('handlebars', engine({}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');
Route(app)
app.use(express.static(path.join(__dirname, '../client/dist')))
app.use(express.static(path.join(__dirname, '../admin/dist')));
app.get("/client/*", (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'))
})

app.get("/admin/*", (req, res) => {
    res.sendFile(path.join(__dirname, '../admin', 'index.html'))
})

const currentDate = new Date();
const year = currentDate.getFullYear()
const month = currentDate.getMonth() + 1
const day = currentDate.getDate();
const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
const now = moment()
Connection.connect().then(async (db) => {
    try {
        const CheckisExpired = await db.collection('Voucher').find({}).toArray()
        CheckisExpired.map(voucher => {
            if (moment(voucher.End_Date).isBefore(now)) {
                db.collection('Voucher').updateOne({ _id: new ObjectId(voucher._id) }, {
                    $set: {
                        isexpired: false,
                    }
                })
                // console.log(voucher.Code_Voucher, 'đã hết hiệu lực');

            } else {
                db.collection('Voucher').updateOne({ _id: new ObjectId(voucher._id) }, {
                    $set: {
                        isexpired: true,
                    }
                })
                console.log(voucher.Code_Voucher, 'Voucher vẫn còn hiệu lực ');
            }
        })
    } catch (error) {
        console.log(error);

    }

})
Connection.connect().then(async (db) => {
    const getVoucher = await db.collection('Voucher').find({}).toArray()
    const getTour = await db.collection('Tours').find({}).toArray()


    let after_discout = 0;
    const result = getVoucher.map((voucher) => {
        const abc = getTour.filter((tour) => {
            if (tour.Price_Tour === voucher.Condition.Min_tour_value && voucher.isexpired === true) {
                // console.log('tour trùng khớp',tour.Price_Tour,tour.Name_Tour);
                after_discout = tour.Price_Tour * (100 - voucher.Discount) / 100
                db.collection('Tours').updateMany(
                    { _id: { $in: [new ObjectId(tour._id)] } },
                    {
                        $set: {
                            After_Discount: after_discout,
                        }
                    }
                )
            }
        })

    })
})

Connection.connect().then(async (db) => {
    const getVoucher = await db.collection('Voucher').find({}).toArray()
    const getTour = await db.collection('Tours').find({}).toArray()

    let abc
    let check_vouchertour
    const result = getVoucher.filter((voucher) => {
        return voucher.isexpired === false
    })
    // console.log(result);

    for (let i = 0; i < getTour.length; i++) {
        for (let j = 0; j < result.length; j++) {
            if (getTour[i].Price_Tour === result[j].Condition.Min_tour_value) {

                db.collection('Tours').updateOne(
                    { _id: { $in: [new ObjectId(getTour[i]._id)] } },
                    {
                        $set: {
                            After_Discount: 0
                        }
                    }
                )
            }

        }
    }
})

// Check time complete trip
Connection.connect().then(async (db) => {
    try {
        const ticket = await db.collection('Tickets').find({}).toArray()
        const resultTicket = ticket.filter(ticket => {
            return ticket.Status_Payment === 'Đã Thanh Toán' && ticket.Status === 'Đã Xác Nhận'
        })
        for (let i = 0; i < resultTicket.length; i++) {
            let StartDate = moment(resultTicket[i].Departure_Date)
            const dayTotal = parseInt(resultTicket[i].Total_DateTrip.slice(0,1))
            const endDate  = StartDate.clone().add(dayTotal - 1,'days')
            const now = moment()
            if(now.isAfter(endDate)){
                const result = await db.collection('Tickets').updateOne(
                    { _id: { $in: [new ObjectId(resultTicket[i]._id)] } },
                    {
                        $set: {
                            Status : 'Đã Hoàn Thành'
                        }
                    }
                )                  
            }
        }
    } catch (error) {
        throw error
    }
})

app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // use cookie-parser to read cookies

const httpServer = createServer(app);
const io = setupSocket(httpServer);
app.set('io', io);


httpServer.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})
export { io }

