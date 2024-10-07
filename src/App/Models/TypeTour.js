class TypeTour {
    constructor(_id, Name_Type) {
        this._id = _id
        this.Name_Type = Name_Type
    }
    static async getAll(db) {
        try {
            const result = await db.collection('TypeTour')
                .find({})
                .toArray()
            return result
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }
    static async FindTypeTour (db,Name_Type) {
        try {
            const resultCheck = await db.collection('TypeTour').findOne({Name_Type : Name_Type})
            return resultCheck ? true : false
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async Create(db) {
        try {
            const CreateType = db.collection('TypeTour').insertOne(this)
            return CreateType
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }
    async Update(db, id) {
        try {
            const Update = db.collection('TypeTour')
                .updateOne({ _id: id }, {
                    $set: {
                        Name_Type: this.Name_Type
                    }
                })
                return Update
        } catch (error) {

        }
    }
    static async Delete(db, id) {
        try {
            const Delete = await db.collection('TypeTour').deleteOne({ _id: id })
            return Delete
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}
export default TypeTour