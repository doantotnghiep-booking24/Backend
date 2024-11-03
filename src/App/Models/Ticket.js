import { ObjectId } from "mongodb"

class Ticket {
    constructor(_id, Departure_Location, Destination, Title_Tour, Price_Tour, After_Discount, Departure_Date, Departure_Time, Total_DateTrip, Adult_fare, Children_fare, Adult, Children, Total_price, id_tour, id_user, id_Service, id_Custommer, id_Voucher, Created_at_Booking, Status, Status_Payment, Payment_Method, isCancle) {
        this._id = _id
        this.Departure_Location = Departure_Location
        this.Destination = Destination
        this.Title_Tour = Title_Tour
        this.Price_Tour = Price_Tour
        this.After_Discount = After_Discount
        this.Departure_Date = Departure_Date
        this.Departure_Time = Departure_Time
        this.Total_DateTrip = Total_DateTrip
        this.Adult_fare = Adult_fare
        this.Children_fare = Children_fare
        this.Adult = Adult
        this.Children = Children
        this.Total_price = Total_price
        this.id_tour = id_tour
        this.id_user = id_user
        this.id_Service = id_Service
        this.id_Custommer = id_Custommer
        this.id_Voucher = id_Voucher
        this.Created_at_Booking = Created_at_Booking
        this.Status = Status
        this.Status_Payment = Status_Payment
        this.Payment_Method = Payment_Method
        this.isCancle = isCancle
    }

    static async GetTicket(db) {
        try {
            const result_GetTicket = await db.collection('Tickets')
                .find({})
                .toArray()
            return result_GetTicket
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    static async UpdateStatusTicket(db, Status, id_Ticket) {
        try {
            const result_Update = await db.collection('Tickets').updateOne(
                { _id: id_Ticket },
                {
                    $set: {
                        Status: Status
                    }
                }
            )
            return result_Update
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async CreateTicket(db) {
        try {
            const result_Create = await db.collection('Tickets')
                .insertOne(this)
            return result_Create
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    static async FindTicket(db, id) {
        try {
            const result_Find = await db.collection('Tickets').find({ _id: id }).toArray()
            if (result_Find) {
                return { result_Find }
            }

            // return result_Find

        } catch (error) {
            console.log(error);

        }
    }
    static async UpdateTicket(db, id_ticket, id_Custommer, Status, Payment_Method) {
        try {
            const result_Update = await db.collection('Tickets').updateOne(
                { _id: id_ticket },
                {
                    $set: {
                        id_Custommer: id_Custommer,
                        Status_Payment: Status,
                        Payment_Method: Payment_Method
                    }
                }
            )
            return result_Update
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    static async UpdateDirctTicket(db, id_ticket, id_Custommer, Status, Payment_method) {
        try {
            const result_Update = await db.collection('Tickets').updateOne(
                { _id: id_ticket },
                {
                    $set: {
                        id_Custommer: id_Custommer,
                        Status_Payment: Status,
                        Payment_Method: Payment_method
                    }
                }
            )
            return result_Update
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    // static async DeleteTicket(db, id) {
    //     try {
    //         const reuslt_Delete = await db.collection('Tickets')
    //             .deleteOne({ _id: id })
    //         return reuslt_Delete
    //     } catch (error) {
    //         console.log(error);
    //         throw error
    //     }
    // }
}
export default Ticket