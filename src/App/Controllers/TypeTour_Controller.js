import Connection from '../../Config/db/index.js'
import TypeTour from '../Models/TypeTour.js';
import { ObjectId } from 'mongodb';
class TypeTour_Controller {
    GetAllTypeTour(req, res, next) {
        Connection.connect().then(async (db) => {
            try {
                const AllTypeTour = await TypeTour.getAll(db)
                if (AllTypeTour) return res.status(200).send({ TypeTour: AllTypeTour })
            } catch (error) {
                console.log(error);
            }
        })
    }
    CreateTypeTour(req, res, next) {
        const { Name_Type } = req.body
        Connection.connect().then(async (db) => {
            const CheckTypeTour = await TypeTour.FindTypeTour(db, Name_Type)
            if (!CheckTypeTour) {
                const CreateTypeTour = new TypeTour(undefined, Name_Type)
                const result = await CreateTypeTour.Create(db)
                if (result) return res.status(200).send({ message: 'Create Success' })
            } else {
                return res.status(400).send({ message: 'Name Type_Tour is already exist' })
            }
        })
    }
    UpdateTypeTour(req, res, next) {
        const { id } = req.params
        const { Name_Type } = req.body
        Connection.connect().then(async (db) => {
            try {
                const UpdateTypeTour = new TypeTour(undefined, Name_Type)
                const result = await UpdateTypeTour.Update(db, new ObjectId(id))
                if (result) return res.status(200).send({ message: 'Update Success' })
            } catch (error) {
                console.log(error);
            }
        })
    }
    DeleteTypeTour(req, res, next) {
        const { id } = req.params
        Connection.connect().then(async (db) => {
            try {
                const DeleteTypeTour = TypeTour.Delete(db, new ObjectId(id))
                if (DeleteTypeTour) return res.status(200).send({ message: 'Delete Success' })
            } catch (error) {
                console.log(error);
            }
        })
    }
}
export default new TypeTour_Controller()