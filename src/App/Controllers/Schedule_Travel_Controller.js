import Connection from '../../Config/db/index.js'
import Schedule from '../Models/Schedule_Travel.js';
import { ObjectId } from 'mongodb';
class Schedule_Travel {
    GetAllSchedule_Travel(req, res, next) {
        Connection.connect().then(async (db) => {
            try {
                const GetSchedule_Travel = await Schedule.GetSchedule_Travel(db)
                if (GetSchedule_Travel) return res.status(200).send({ Schedule_Travel: GetSchedule_Travel })
            } catch (error) {
                console.log(error);
            }
        })
    }
    CreateSchedule_Travel(req, res, next) {
        const { Departure_Time, Location, means_of_transport } = req.body
        Connection.connect().then(async (db) => {
            try {
                const Create = new Schedule(undefined, Departure_Time, Location, means_of_transport)
                const result = await Create.CreateSchedule_Travel(db)
                if (result) return res.status(200).send({ message: 'Created Success' })
            } catch (error) {
                console.log(error);
            }
        })
    }
    UpdateSchedule_Travel(req, res, next) {
        const { id } = req.params
        const { Departure_Time, Location, means_of_transport } = req.body
        Connection.connect().then(async (db) => {
            try {
                const Update = new Schedule(undefined, Departure_Time, Location, means_of_transport)
                const result = await Update.UpdateSchedule_Travel(db, new ObjectId(id))
                if (result) return res.status(200).send({ message: 'Updated Success' })
            } catch (error) {
                console.log(error);
            }
        })
    }
    DeleteSchedule_Travel(req, res, next) {
        const { id } = req.params
        Connection.connect().then(async (db) => {
            try {
                const Delete = Schedule.DeleteSchedule_Travel(db, new ObjectId(id))
                if (Delete) return res.status(200).send({ message: 'Deleted Success' })
            } catch (error) {
                console.log(error);
            }
        })
    }
}
export default new Schedule_Travel()