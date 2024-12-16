import { v2 as cloudinary } from 'cloudinary';
const NAME_COLLECTION = "Reviews"
class Review {
    constructor(_id, userId, tourId, rating, Created_At, isDeleted = false) {
        this._id = _id
        this.userId = userId
        this.tourId = tourId
        this.rating = rating
        this.Created_At = Created_At
        this.isDeleted =isDeleted
    }

    static async getAll(db, dbTourId) {
        try {
            const result = await db.collection(NAME_COLLECTION)
                .find({tourId: dbTourId})
                .toArray()
            return result
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }
    async Create(db) {
        try {
            const Create_Reivew = db.collection(NAME_COLLECTION).insertOne(this)
            return Create_Reivew
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }
    async Update(db, id) {
        try {
            const Update = db.collection(NAME_COLLECTION)
                .updateOne({ _id: id }, {
                    $set: {
                        Name: this.Name,
                        Title: this.Title,
                        Content: this.Content,
                        Image: this.Image,
                        Cretate_At: this.Cretate_At
                    }
                })
            return Update ? true : false
        } catch (error) {

        }
    }
    static async Delete(db, id) {
        try {
            let filenameRm
            const Data_ImageRm = await db.collection(NAME_COLLECTION).find({ _id: id }).toArray()
            if (Data_ImageRm) {
                const Delete = await db.collection(NAME_COLLECTION).deleteOne({ _id: id })
                if (Delete) {
                    Data_ImageRm.map(data_new => {
                        filenameRm = data_new.Image
                    })
                    for (let i = 0; i < filenameRm.length; i++) {
                        cloudinary.api.delete_resources(filenameRm[i].filename, (error, result) => {
                            console.log(result);
                        })
                    }
                }
                return Delete ? true : false
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}
export default Review