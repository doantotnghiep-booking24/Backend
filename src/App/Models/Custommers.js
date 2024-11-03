class Custommers {
    constructor(_id, Create_by, Name_Customer, Date_Of_Birth, Sex_Customer, Phone_Number, Citizen_Identification, Address) {
            this._id = _id
            this.Create_by = Create_by
            this.Name_Customer = Name_Customer
            this.Date_Of_Birth = Date_Of_Birth
            this.Sex_Customer = Sex_Customer
            this.Phone_Number = Phone_Number
            this.Citizen_Identification = Citizen_Identification
            this.Address = Address
    }
    static async getCus(db) {
        try {
            const result = await db.collection('Custommers')
                .find({})
                .toArray()
            return result
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }
    static async FindCustommer(db, id_Cus) {
        try {
            const resultCheck = await db.collection('Custommers').find({ _id: id_Cus }).toArray()
            return resultCheck 
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async Create(db) {
        try {
            const CreateCustommer = db.collection('Custommers').insertOne(this)
            return CreateCustommer
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }
    static async Update(db, id) {
        try {
            const Update = db.collection('Custommers')
                .updateOne({ _id: id }, {
                    $set: {
                        Name_Cate: this.Name_Cate
                    }
                })
            return Update
        } catch (error) {

        }
    }
}
export default Custommers