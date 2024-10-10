import Connection from '../../Config/db/index.js'
import Tour from '../Models/Tour.js';
import { ObjectId } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
class Tour_Controller {
    Create_Tour(req, res, next) {
        let Data_Image = []
        let Data_rm = []
        let filesData = req.files
        let { id_Schedule_Travel, id_Category, id_Service, id_Featured_Location, id_Type_Tour, Name_Tour, Price_Tour, Image_Tour, Title_Tour, Description_Tour, Start_Tour, End_Tour, total_Date } = req.body
        Connection.connect().then(async (db) => {
            try {
                for (let i = 0; i < filesData.length; i++) {
                    Data_Image.push(filesData[i])
                    Data_rm.push(filesData[i].filename)
                }
                Image_Tour = Data_Image
                const Create_Tour = new Tour(undefined, id_Schedule_Travel, id_Category, id_Service, id_Featured_Location, id_Type_Tour, Name_Tour, Price_Tour, Image_Tour, Title_Tour, Description_Tour, Start_Tour, End_Tour, total_Date)
                const result = await Create_Tour.CreateTour(db)
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
            } catch (error) {
                console.log(error)
            }
        })
    }
    GetAllTour(req, res) {
        const { page, limit } = req.query
        Connection.connect().then(async (db) => {
            try {
                const AllTour = await Tour.ShowAll(db, parseInt(page), parseInt(limit))
                if (AllTour) {
                    return res.status(200).send({ Tours: AllTour })
                }
            } catch (error) {
                console.log(error);
            }
        })
    }
    DeleteTour(req, res, next) {
        const { id } = req.params
        Connection.connect().then(async (db) => {
            try {
                const Delete_Tour = await Tour.Delete(db, new ObjectId(id))
                if (Delete_Tour) {
                    return res.status(200).send({ message: "Delete Success" })
                }
            } catch (error) {
                console.log(error);
            }
        })
    }
    UpdateTour(req, res, next) {
        const { id } = req.params
        let { id_Schedule_Travel, id_Category, id_Service, id_Featured_Location, id_Type_Tour, Name_Tour, Price_Tour, Image_Tour, Title_Tour, Description_Tour, Start_Tour, End_Tour, total_Date } = req.body
        let Data_rm = []
        let Data_Image = []
        let Data_Path = []
        let filesData = req.files
        let count = 0
        let filenameUpd
        Connection.connect().then(async (db) => {
            try {
                const filterNews = await db.collection('Tours').find({ _id: new ObjectId(id) }).toArray()
                for (let i = 0; i < filesData.length; i++) {
                    Data_Image.push(filesData[i])
                    Data_rm.push(filesData[i].filename)
                    Data_Path.push(filesData[i].path)
                    count++
                }
                Image_Tour = Data_Image
                const Update_Tour = new Tour(undefined, id_Schedule_Travel, id_Category, id_Service, id_Featured_Location, id_Type_Tour, Name_Tour, Price_Tour, Image_Tour, Title_Tour, Description_Tour, Start_Tour, End_Tour, total_Date)
                if (Update_Tour) {
                    const result = await Update_Tour.UpdateTour(db, new ObjectId(id))
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
                            filenameUpd = data_new.Image_Tour
                        })
                        for (let i = 0; i < filenameUpd.length; i++) {
                            cloudinary.api.delete_resources(filenameUpd[i].filename, (error, result) => {
                                console.log('error', error);
                                console.log('result', result);
                            })
                        }
                        return res.status(200).send({ message: 'Update Success' })
                    }
                }
            } catch (error) {
                console.log(error);
            }
        })
    }
    SearchTour(req, res, next) {
        const { NameSearch, page, limit, PriceSearch } = req.query
        Connection.connect().then(async (db) => {
            try {
                const resultSearch = await Tour.Search(db, NameSearch, parseInt(PriceSearch), parseInt(page), parseInt(limit))
                if (resultSearch) return res.status(200).send({ search: resultSearch })
            } catch (error) {
                console.log(err)
            }
        })
    }
    DetailTour(req, res, next) {
        const { id } = req.params
        Connection.connect().then(async (db) => {
            try {
                const detailTour = await Tour.Detail(db, new ObjectId(id))
                if (detailTour) return res.status(200).send({ detailTour: detailTour })
            } catch (error) {
                console.log(error);
            }
        })
    }
}
export default new Tour_Controller()