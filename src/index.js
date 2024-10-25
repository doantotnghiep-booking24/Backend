import express from 'express'
import cookieParser from 'cookie-parser'; // import cookie-parser to use req.cookies
import cors from 'cors'
import Route from './Routes/index.js';
import Connection from './Config/db/index.js'
import { ObjectId } from 'mongodb';
import setupSocket from './socket.js';
import { createServer } from 'http';
const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
Connection.connect().then(async (db) => {
    try {
        const currentDate = new Date();
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() + 1
        const day = currentDate.getDate();
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const CheckisExpired = await db.collection('Voucher').find({}).toArray()
        let id
        CheckisExpired.map(voucher => {
            if (voucher.End_Date <= formattedDate) {
                db.collection('Voucher').updateOne({ _id: new ObjectId(voucher._id) }, {
                    $set: {
                        isexpired: false
                    }
                })
            } else {
                db.collection('Voucher').updateOne({ _id: new ObjectId(voucher._id) }, {
                    $set: {
                        isexpired: true
                    }
                })
            }
        })
    } catch (error) {
        console.log(error);

    }

})
Connection.connect().then(async (db) => {
    const getVoucher = await db.collection('Voucher').find({}).toArray()
    const getTour = await db.collection('Tours').find({}).toArray()
    const getCate = await db.collection('Categories').find({}).toArray()

    let after_discout = 0
    let result
    for (let i = 0; i < getTour.length; i++) {
        for (let j = 0; j < getCate.length; j++) {
            result = getVoucher.filter(voucher => {
                if (voucher.Condition.Min_tour_value === getTour[i].Price_Tour && voucher.isexpired === true && voucher.Condition.Tour_categories.toLowerCase() === getCate[j].Name_Cate.toLowerCase()) {
                    after_discout = getTour[i].Price_Tour * (1 - voucher.Discount / 100)
                    db.collection('Tours').updateOne(
                        { _id: new ObjectId(getTour[i]._id) },
                        {
                            $set: {
                                After_Discount: after_discout,
                            }
                        }
                    )
                    db.collection('Voucher').updateOne({ _id: new ObjectId(getTour[i]._id) }, {
                        $set: {
                            isexpired: true
                        }
                    })
                }
            })
        }
    }
})
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // use cookie-parser to read cookies

const httpServer = createServer(app);
const io = setupSocket(httpServer);
app.set('io', io);
Route(app)

httpServer.listen(3001)
export { io }

