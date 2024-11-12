import { v2 as cloudinary } from 'cloudinary';
class News {
    constructor(_id, Name, Title, Content, Image, Cretate_At, isDeleted = false) {
        this._id = _id
        this.Name = Name
        this.Title = Title
        this.Content = Content
        this.Image = Image
        this.Cretate_At = Cretate_At
        this.isDeleted = isDeleted
    }
    static async getAll(db) {
        try {
            const result = await db.collection('News')
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
            const Create_News = db.collection('News').insertOne(this)
            return Create_News ? true : false
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }
    async Update(db, id) {
        try {
            const Update = db.collection('News')
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
            const Data_ImageRm = await db.collection('News').find({ _id: id }).toArray()
            if (Data_ImageRm) {
                const Delete = await db.collection('News').deleteOne({ _id: id })
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
    static async Detail(db, id) {
        const resultDetail = await db.collection('News')
            .find({ _id: id })
            .toArray()
        return resultDetail
    }
    static async Remove(db, id) {
        try {
            let Delete;
            const Data_ImageRm = await db.collection('News').findOne({ _id: id });

            if (Data_ImageRm.isDeleted === false) {
                Delete = await db.collection('News').updateOne({ _id: id }, { $set: { isDeleted: true } })
            } else {
                Delete = await db.collection('News').updateOne({ _id: id }, { $set: { isDeleted: false } })
            }

            return Delete
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}
export default News
