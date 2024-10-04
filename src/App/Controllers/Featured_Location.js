import Connection from '../../Config/db/index.js'
import Featured_Locations from '../Models/Featured_Location.js';
import { ObjectId } from 'mongodb';
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
        const { Name_Location, Address_Location, Image_Location, Type_Location, Nationnal, City_Location } = req.body
        Connection.connect().then(async (db) => {
            const CreateFeatured = new Featured_Locations(undefined, Name_Location,Address_Location,Image_Location,Type_Location,Nationnal,City_Location)
            const result = await CreateFeatured.Create(db)
            if (result) return res.status(200).send({ message: 'Create Success' })
        })
    }
    UpdateFeatured_Location(req, res, next) {
        const { id } = req.params
        const { Name_Location, Address_Location, Image_Location, Type_Location, Nationnal, City_Location } = req.body
        Connection.connect().then(async (db) => {
            try {
                const UpdateFeatured = new Featured_Locations(undefined, Name_Location,Address_Location,Image_Location,Type_Location,Nationnal,City_Location)
                const result = await UpdateFeatured.Update(db, new ObjectId(id))
                if (result) return res.status(200).send({ message: 'Update Success' })
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