class Hotel {
    constructor(_id, Name_Hotel, Price_Hotel, Adress_Hotel, Description_Hotel, Image_Hotel) {
        this._id = _id
        this.Name_Hotel = Name_Hotel
        this.Price_Hotel = Price_Hotel
        this.Adress_Hotel = Adress_Hotel
        this.Description_Hotel = Description_Hotel
        this.Image_Hotel = Image_Hotel
    }
    static async getAll(db) {
        try {
            const result = await db.collection('Hotels')
                .find({})
                .toArray()
            return result
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }
    async Create(db) {
        try {
            const Create_Hotel = db.collection('Hotels').insertOne(this)
            return Create_Hotel
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }
    async Update(db, id) {
        try {
            const Update = db.collection('Hotels')
                .updateOne({ _id: id }, {
                    $set: {
                        Name_Hotel: this.Name_Hotel,
                        Price_Hotel: this.Price_Hotel,
                        Adress_Hotel: this.Adress_Hotel,
                        Description_Hotel: this.Description_Hotel,
                        Image_Hotel: this.Image_Hotel,
                    }
                })
            return Update
        } catch (error) {

        }
    }
    static async Delete(db, id) {
        try {
            const Delete = await db.collection('Hotels').deleteOne({ _id: id })
            return Delete
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}
export default Hotel