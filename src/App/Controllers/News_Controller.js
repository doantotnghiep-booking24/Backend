import Connection from '../../Config/db/index.js'
import News from '../Models/News.js';
import { ObjectId } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
class News_Controller {
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
        let Data_Image = []
        let Data_rm = []
        let filesData = req.files
        let { Name, Title, Content, Image, Cretate_At } = req.body
        try {
            Connection.connect().then(async (db) => {
                Cretate_At = new Date()
                for (let i = 0; i < filesData.length; i++) {
                    Data_Image.push(filesData[i])
                    Data_rm.push(filesData[i].filename)
                }
                Image = Data_Image
                const CreateNew = new News(undefined, Name, Title, Content, Image, Cretate_At)
                const result = await CreateNew.Create(db)
                if (!result && Name === "" && Title === "" && Content === "" && Image === "") {
                    if (filesData) {
                        for (let i = 0; i < filesData.length; i++) {
                            cloudinary.api.delete_resources(filesData[i].filename, (error, result) => {
                                console.log(result, error);
                            })
                        }
                    }
                    return res.status(400).send({ Message: "You need to fill in complete information" })
                }
                res.status(200).send({ message: 'Create Success' })
            })

        } catch (error) {
            console.log(error);

        }
    }
    UpdateNew(req, res, next) {
        const { id } = req.params
        let Data_rm = []
        let Data_Image = []
        let Data_Path = []
        let filesData = req.files
        let count = 0
        let filenameUpd
        let { Name, Title, Content, Image, Cretate_At } = req.body
        Connection.connect().then(async (db) => {
            try {
                const filterNews = await db.collection('News').find({ _id: new ObjectId(id) },).toArray()
                for (let i = 0; i < filesData.length; i++) {
                    Data_Image.push(filesData[i])
                    Data_rm.push(filesData[i].filename)
                    Data_Path.push(filesData[i].path)
                    count++
                }
                Image = Data_Image
                const UpdateNew = new News(undefined, Name, Title, Content, Image, Cretate_At)
                const result = await UpdateNew.Update(db, new ObjectId(id))
                if (!result) {
                    if (filesData) {
                        cloudinary.api.delete_resources(Data_rm[count], (error, result) => {
                            console.log('error', error);
                            console.log('result', result);
                        })
                    }
                } else {
                    filterNews.map(data_new => {
                        filenameUpd = data_new.Image
                    })
                    for (let i = 0; i < filenameUpd.length; i++) {
                        cloudinary.api.delete_resources(filenameUpd[i].filename, (error, result) => {
                            console.log('error', error);
                            console.log('result', result);
                        })
                    }
                    return res.status(200).send({ message: 'Update Success' })
                }
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
export default new News_Controller()