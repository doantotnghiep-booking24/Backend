import Connection from '../../Config/db/index.js'
import Featured_Locations from '../Models/Featured_Location.js';
import { ObjectId } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
class Featured_Location {
    GetAllFeatured_Location(req, res, next) {
        Connection.connect().then(async (db) => {
            try {
                const AllFeatured_Location = await Featured_Locations.getAll(db)
                if (AllFeatured_Location) return res.status(200).send({ Featured_Location: AllFeatured_Location })
            } catch (error) {
                console.log(error);
            }
        })
    }
    CreateFeatured_Location(req, res, next) {
        let Data_Image = []
        let Data_rm = []
        let filesData = req.files
        let { Name_Location, Address_Location, Description, Image_Location, Type_Location, Nationnal, City_Location, id_tour } = req.body
        Connection.connect().then(async (db) => {
            for (let i = 0; i < filesData.length; i++) {
                Data_Image.push(filesData[i])
                Data_rm.push(filesData[i].filename)
            }
            Image_Location = Data_Image
            const CreateFeatured = new Featured_Locations(undefined, Name_Location, Address_Location, Description, Image_Location, Type_Location, Nationnal, City_Location, id_tour)
            const result = await CreateFeatured.Create(db)
            if (!result) {
                if (filesData) {
                    for (let i = 0; i < filesData.length; i++) {
                        cloudinary.api.delete_resources(filesData[i].filename, (error, result) => {
                            console.log(result, error);
                        })
                    }
                }
                return res.status(400).send({ message: 'Created Tour Failed' })
            }
            return res.status(200).send({ message: 'Created Tour Success' })
        })
    }
    UpdateFeatured_Location(req, res, next) {
        const { id } = req.params
        let { Name_Location, Address_Location, Description, Image_Location, Type_Location, Nationnal, City_Location, id_tour } = req.body
        let Data_rm = []
        let Data_Image = []
        let Data_Path = []
        let filesData = req.files
        let count = 0
        let filenameUpd
        Connection.connect().then(async (db) => {
            try {
                const filterNews = await db.collection('Featured_Location').find({ _id: new ObjectId(id) },).toArray()
                for (let i = 0; i < filesData.length; i++) {
                    Data_Image.push(filesData[i])
                    Data_rm.push(filesData[i].filename)
                    Data_Path.push(filesData[i].path)
                    count++
                }
                Image_Location = Data_Image
                const UpdateFeatured = new Featured_Locations(undefined, Name_Location, Address_Location, Description, Image_Location, Type_Location, Nationnal, City_Location, id_tour)
                const result = await UpdateFeatured.Update(db, new ObjectId(id))
                if (!result) {
                    if (filesData) {
                        cloudinary.api.delete_resources(Data_rm[count], (error, result) => {
                            console.log('error', error);
                            console.log('result', result);
                        })
                    }
                    return res.status(400).send({ message: 'Update Failed' })
                } else {
                    filterNews.map(data_new => {
                        filenameUpd = data_new.Image_Location
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
    DeleteFeatured_Location(req, res, next) {
        const { id } = req.params
        Connection.connect().then(async (db) => {
            try {
                const DeleteFeatured = Featured_Locations.Delete(db, new ObjectId(id))
                if (DeleteFeatured) return res.status(200).send({ message: 'Delete Success' })
            } catch (error) {
                console.log(error);
            }
        })
    }
}
export default new Featured_Location()