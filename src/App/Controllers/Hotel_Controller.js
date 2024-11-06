import Connection from '../../Config/db/index.js'
import Hotels from '../Models/Hotel.js';
import { ObjectId } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
class Hotel {
    GetAllHotel(req, res, next) {
        Connection.connect().then(async (db) => {
            try {
                const AllHotel = await Hotels.getAll(db)
                if (AllHotel) return res.status(200).json({ Hotel: AllHotel })
            } catch (error) {
                console.log(error);
            }
        })
    }
    CreateHotel(req, res, next) {
        let Data_Image = []
        let Data_rm = []
        let filesData = req.files
        let { Name_Hotel, Price_Hotel, Adress_Hotel, Description_Hotel, Image_Hotel } = req.body
        console.log(Name_Hotel);

        Connection.connect().then(async (db) => {
            for (let i = 0; i < filesData.length; i++) {
                Data_Image.push(filesData[i])
                Data_rm.push(filesData[i].filename)
            }
            Image_Hotel = Data_Image
            const CreateHotel = new Hotels(undefined, Name_Hotel, Price_Hotel, Adress_Hotel, Description_Hotel, Image_Hotel)
            const result = await CreateHotel.Create(db)
            if (!result) {
                if (filesData) {
                    for (let i = 0; i < filesData.length; i++) {
                        cloudinary.api.delete_resources(filesData[i].filename, (error, result) => {
                            console.log(result, error);
                        })
                    }
                }
                return res.status(400).json({ message: 'Created Hotel Failed' })
            }
            return res.status(200).json({ message: 'Created Hotel Success' })
        })
    }
    UpdateHotel(req, res, next) {
        const { id } = req.params
        let { Name_Hotel, Price_Hotel, Adress_Hotel, Description_Hotel, Image_Hotel } = req.body
        let Data_rm = []
        let Data_Image = []
        let Data_Path = []
        let filesData = req.files
        let count = 0
        let filenameUpd
        Connection.connect().then(async (db) => {
            try {
                const filterHotel = await db.collection('Hotels').find({ _id: new ObjectId(id) },).toArray()
                for (let i = 0; i < filesData.length; i++) {
                    Data_Image.push(filesData[i])
                    Data_rm.push(filesData[i].filename)
                    Data_Path.push(filesData[i].path)
                    count++
                }
                Image_Hotel = Data_Image
                const UpdateHotel = new Hotels(undefined, Name_Hotel, Price_Hotel, Adress_Hotel, Description_Hotel, Image_Hotel)
                const result = await UpdateHotel.Update(db, new ObjectId(id))
                if (!result) {
                    if (filesData) {
                        cloudinary.api.delete_resources(Data_rm[count], (error, result) => {
                            console.log('error', error);
                            console.log('result', result);
                        })
                    }
                    return res.status(400).json({ message: 'Update Failed' })
                } else {
                    filterHotel.map(data_new => {
                        filenameUpd = data_new.Image_Hotel
                    })
                    for (let i = 0; i < filenameUpd.length; i++) {
                        cloudinary.api.delete_resources(filenameUpd[i].filename, (error, result) => {
                            console.log('error', error);
                            console.log('result', result);
                        })
                    }
                    return res.status(200).json({ message: 'Update Success' })
                }
            } catch (error) {
                console.log(error);
            }
        })
    }
    DeleteHotel(req, res, next) {
        const { id } = req.params
        let filenamedlt
        Connection.connect().then(async (db) => {
            try {
                const filterHotel = await db.collection('Hotels').find({ _id: new ObjectId(id) },).toArray()
                const DeleteHotel = Hotels.Delete(db, new ObjectId(id))
                if (DeleteHotel) {
                    filterHotel.map(hotel => {
                        filenamedlt = hotel.Image_Hotel
                    })
                    for (let i = 0; i < filenamedlt.length; i++) {
                        cloudinary.api.delete_resources(filenamedlt[i].filename, (error, result) => {
                            console.log('error', error);
                            console.log('result', result);
                        })
                    }
                    return res.status(200).json({ message: 'Delete Success' })
                }
            } catch (error) {
                console.log(error);
            }
        })
    }
}
export default new Hotel()