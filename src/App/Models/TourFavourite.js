class TourFavourite {
    constructor(_id, id_User, id_Tour, isCheckFavourite) {
        this._id = _id
        this.id_User = id_User
        this.id_Tour = id_Tour
        this.isCheckFavourite = isCheckFavourite
    }
    static async getAll(db) {
        try {
            const result = await db.collection('TourFavourites')
                .find({})
                .toArray()
            return result
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }
    static async FindTourFav(db, id) {
        try {
            const result = await db.collection('TourFavourites')
                .find({ })
                .toArray()
            return result
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }
    async Create(db) {
        try {
            const CreateTourFavourite = db.collection('TourFavourites').insertOne(this)
            return CreateTourFavourite
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }
    // static async Update(db, id) {
    //     try {
    //         const Update = db.collection('TourFavourites')
    //             .updateOne({ _id: id }, {
    //                 $set: {
    //                     isCheckFavourite: false
    //                 }
    //             })
    //             return Update
    //     } catch (error) {

    //     }
    // }
    static async Delete(db, id) {
        try {
            const Delete = await db.collection('TourFavourites').deleteOne({ id_User: id })
            return Delete
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}
export default TourFavourite