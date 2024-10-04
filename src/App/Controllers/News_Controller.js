import Connection from '../../Config/db/index.js'
import News from '../Models/News.js';
import { ObjectId } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
class Featured_Location {
    GetAllNews(req, res, next) {
        Connection.connect().then(async (db) => {
            try {
                const AllNews = await News.getAll(db)
                if (AllNews) return res.status(200).send({ Featured_Location: AllNews })
            } catch (error) {
                console.log(error);
            }
        })
    }
    CreateNew(req, res, next) {
        try {
            let Data_Image = []
            let Data_rm = []
            let count = 0
            let filesData = req.files
            let { Name, Title, Content, Image, Cretate_At } = req.body
            Cretate_At = new Date();
            for (let i = 0; i < filesData.length; i++) {
                Data_Image.push(filesData[i])
                Data_rm.push(filesData[i].filename)
                count++
            }
            Image = Data_Image
            Connection.connect().then(async (db) => {
                const CreateNew = new News(undefined, Name, Title, Content, Image, Cretate_At)
                const result = await CreateNew.Create(db)
                if (!result) {
                    if (filesData) {
                        cloudinary.api.delete_resources(Data_rm[count], (error, result) => {
                            console.log(result, error);
                        })
                    }
                }
                res.status(200).send({ message: 'Create Success' })
            })

        } catch (error) {
            console.log(error);

        }
    }
    UpdateNew(req, res, next) {
        const { id } = req.params
        const { Name, Title, Content, Image, Cretate_At } = req.body
        Connection.connect().then(async (db) => {
            try {
                const UpdateNew = new News(undefined, Name, Title, Content, Image, Cretate_At)
                const result = await UpdateNew.Update(db, new ObjectId(id))
                if (result) return res.status(200).send({ message: 'Update Success' })
            } catch (error) {
                console.log(error);
            }
        })
    }
    DeleteNew(req, res, next) {
        const { id } = req.params
        Connection.connect().then(async (db) => {
            try {
                const DeleteNew = await News.Delete(db, new ObjectId(id))    
                if (DeleteNew) return res.status(200).send({ message: 'Delete Success' })
            } catch (error) {
                console.log(error);
            }
        })
    }
}
export default new Featured_Location()