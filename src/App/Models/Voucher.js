class Voucher {
    constructor(_id, Code_Voucher, Description, Discount, Type, Start_Date, End_Date, Max_Usage, Condition,isexpired) {
        this._id = _id
        this.Code_Voucher = Code_Voucher
        this.Description = Description
        this.Discount = Discount
        this.Type = Type
        this.Start_Date = Start_Date
        this.End_Date = End_Date
        this.Max_Usage = Max_Usage
        this.Condition = Condition
        this.isexpired = isexpired
    }
    static async getAll(db) {
        try {
            const result = await db.collection('Voucher')
                .find({})
                .toArray()
            return result
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }
    static async FindVoucher(db, Code_Voucher) {
        try {
            const resultCheck = await db.collection('Voucher').findOne({ Code_Voucher: Code_Voucher })
            return resultCheck ? true : false
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async Create(db) {
        try {
            const CreateVoucher = db.collection('Voucher').insertOne(this)
            return CreateVoucher
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }
    async Update(db, id) {
        try {
            const Update = db.collection('Voucher')
                .updateOne({ _id: id }, {
                    $set: {
                        Code_Voucher: this.Code_Voucher,
                        Description: this.Description,
                        Discount: this.Discount,
                        Type: this.Type,
                        Start_Date: this.Start_Date,
                        End_Date: this.End_Date,
                        Max_Usage: this.Max_Usage,
                        Condition: this.Condition,
                    }
                })
            return Update
        } catch (error) {

        }
    }
    static async Delete(db, id) {
        try {
            const Delete = await db.collection('Voucher').deleteOne({ _id: id })
            return Delete
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}
export default Voucher