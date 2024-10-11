import express from 'express'
import cookieParser from 'cookie-parser'; // import cookie-parser to use req.cookies
import cors from 'cors'
import Route from './Routes/index.js';
import Connection from './Config/db/index.js'
const app = express()

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))
Connection.connect().then(async (db) => {
    const CheckisExpired = await db.collection('Voucher').find({}).toArray()
    console.log(CheckisExpired);
    
})
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // use cookie-parser to read cookies
Route(app)

app.listen(3001)