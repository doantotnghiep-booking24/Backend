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
const app = express()
// console.log('123');

app.use(cors(corsOptions))

app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // use cookie-parser to read cookies



app.engine('handlebars', engine({}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

Route(app)
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
                console.log(voucher.Code_Voucher, 'đã hết hiệu lực');
            } else {
                db.collection('Voucher').updateOne({ _id: new ObjectId(voucher._id) }, {
                    $set: {
                        isexpired: true,
                    }
                })
                console.log(voucher.Code_Voucher, 'Voucher vẫn còn hiệu lực ')
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
                    { _id: { $in: [new ObjectId(getTour._id)] } },
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
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // use cookie-parser to read cookies

const httpServer = createServer(app);
const io = setupSocket(httpServer);
app.set('io', io);
Route(app)

httpServer.listen(3001)
export { io }

