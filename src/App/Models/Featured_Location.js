class Featured_Location {
    constructor(_id, Name_Location, Address_Location, Description, Image_Location, Type_Location, Nationnal, City_Location, id_tour, isDeleted = false) {
        this._id = _id
        this.Name_Location = Name_Location
        this.Address_Location = Address_Location
        this.Description = Description
        this.Image_Location = Image_Location
        this.Type_Location = Type_Location
        this.Nationnal = Nationnal
        this.City_Location = City_Location
        this.id_tour = id_tour
        this.isDeleted = isDeleted
    }
    static async getAll(db) {
        try {
            const result = await db.collection('Featured_Location')
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
            const Create_Featured_Location = db.collection('Featured_Location').insertOne(this)
            return Create_Featured_Location
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }
    async Update(db, id) {
        try {
            const Update = db.collection('Featured_Location')
                .updateOne({ _id: id }, {
                    $set: {
                        Name_Location: this.Name_Location,
                        Address_Location: this.Address_Location,
                        Description: this.Description,
                        Image_Location: this.Image_Location,
                        Type_Location: this.Type_Location,
                        Nationnal: this.Nationnal,
                        City_Location: this.City_Location,
                        id_tour: this.id_tour
                    }
                })
            return Update
        } catch (error) {

        }
    }
    static async Delete(db, id) {
        try {
            const Delete = await db.collection('Featured_Location').deleteOne({ _id: id })
            return Delete
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    static async Remove(db, id) {
        try {
            let Delete;
            const findIsDeleted = await db.collection('Featured_Location').findOne({ _id: id });

            if (findIsDeleted.isDeleted === false) {
                Delete = await db.collection('Featured_Location').updateOne({ _id: id }, { $set: { isDeleted: true } })
            } else {
                Delete = await db.collection('Featured_Location').updateOne({ _id: id }, { $set: { isDeleted: false } })
            }

            return Delete
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    static async Detail(db, id) {
        const resultDetail = await db.collection('Featured_Location')
            .find({ _id: id })
            .toArray()
        return resultDetail
    }
}
export default Featured_Location
