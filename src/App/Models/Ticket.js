class Ticket {
    constructor(_id, NameTicket) {
        this._id = _id
        this.NameTicket = NameTicket
    }
    
   static async GetTicket(db) {
        try {
            const result_GetTicket = await db.collection('Ticket')
                .find({})
                .toArray()
            return result_GetTicket
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    static async FindTicket(db,NameTicket){
        try {
            const resultCheck = await db.collection('Tickets').findOne({NameTicket : NameTicket})
            return resultCheck ? true : false
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
    async UpdateTicket(db, id) {
        try {
            const result_Update = await db.collection('Tickets').updateOne(
                    { _id: id },
                    {
                        $set: {
                            NameTicket: this.NameTicket
                        }
                    }
                )
            return result_Update
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    static async DeleteTicket(db, id) {
        try {
            const reuslt_Delete = await db.collection('Tickets')
                .deleteOne({ _id: id })
            return reuslt_Delete
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}
export default Ticket