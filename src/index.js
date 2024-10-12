import express from 'express'
import cookieParser from 'cookie-parser'; // import cookie-parser to use req.cookies
import cors from 'cors'
import Route from './Routes/index.js';
import Connection from './Config/db/index.js'
import { ObjectId } from 'mongodb';
const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
Connection.connect().then(async (db) => {
    try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
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

            }
        })
    } catch (error) {
        console.log(error);

    }

})
Connection.connect().then(async (db) => {
    const getVoucher = await db.collection('Voucher').find({}).toArray()
    const getTour = await db.collection('Tours').find({}).toArray()
    let after_discout = 0
    let result
    for (let i = 0; i < getTour.length; i++) {
        result = getVoucher.filter(voucher => {
            if (voucher.Condition.Min_tour_value === getTour[i].Price_Tour && voucher.isexpired === true) {
                after_discout = getTour[i].Price_Tour * (1 - voucher.Discount / 100)
                db.collection('Tours').updateOne(
                    { _id: new ObjectId(getTour[i]._id) },
                    {
                        $set: {
                            After_Discount: after_discout,
                        }
                    }
                )
            }

        })
    }
})
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // use cookie-parser to read cookies
Route(app)

app.listen(3001)