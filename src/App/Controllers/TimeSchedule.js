import Connection from '../../Config/db/index.js'
import TimeSchedules from "../Models/TimeSchedule.js";
import { ObjectId } from 'mongodb';
class TimeSchedules_Controller {
    GetAllTimeSchedule(req, res, next) {
        Connection.connect().then(async (db) => {
            try {
                const AllTimeSchedules = await TimeSchedules.getAll(db)
                if (AllTimeSchedules) return res.status(200).json({ TimeSchedules: AllTimeSchedules })
            } catch (error) {
                console.log(error);
            }
        })
    }
    CreateTimeSchedule(req, res, next) {
        const { TimeSchedule } = req.body
        Connection.connect().then(async (db) => {
                const CreateTimeSchedule = new TimeSchedules(undefined, TimeSchedule)
                const result = await CreateTimeSchedule.Create(db)
                if (result) return res.status(200).json({ message: 'Create Success' })
        })
    }
    UpdateTimeSchedule(req, res, next) {
        const { id } = req.params
        const { TimeSchedule } = req.body
        Connection.connect().then(async (db) => {
            try {
                const UpdateTimeSchedule = new TimeSchedules(undefined, TimeSchedule)
                const result = await UpdateTimeSchedule.Update(db, new ObjectId(id))
                if (result) return res.status(200).json({ message: 'Update Success' })
            } catch (error) {
                console.log(error);
            }
        })
    }
    DeleteTimeSchedule(req, res, next) {
        const { id } = req.params
        Connection.connect().then(async (db) => {
            try {
                const DeleteTimeSchedule = TimeSchedules.Delete(db, new ObjectId(id))
                if (DeleteTimeSchedule) return res.status(200).json({ message: 'Delete Success' })
            } catch (error) {
                console.log(error);
            }
        })
    }
}
export default new TimeSchedules_Controller()