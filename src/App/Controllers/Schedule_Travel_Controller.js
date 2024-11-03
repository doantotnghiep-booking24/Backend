import Connection from '../../Config/db/index.js'
import Schedule from '../Models/Schedule_Travel.js';
import { ObjectId } from 'mongodb';
class Schedule_Travel {
    GetAllSchedule_Travel(req, res, next) {
        Connection.connect().then(async (db) => {
            try {
                const GetSchedule_Travels = await Schedule.GetSchedule_Travel(db)
                if (GetSchedule_Travel) return res.status(200).json({ Schedule_Travels: GetSchedule_Travels })
            } catch (error) {
                console.log(error);
            }
        })
    }
    GetSchedule_Travel(req, res, next) {
        const { id } = req.params
        Connection.connect().then(async (db) => {
            try {
                const GetSchedule_Travel = await Schedule.GetSchedule_Travelbyid(db, id)
                if (GetSchedule_Travel) return res.status(200).json({ Schedule_Travel: GetSchedule_Travel })
            } catch (error) {
                console.log(error);
            }
        })
    }
    CreateSchedule_Travel(req, res, next) {
        const { Name_Schedule, Time_Morning_Schedule, Text_Schedule_Morning, Time_Noon_Schedule, Text_Schedule_Noon, Time_Afternoon_Schedule, Text_Schedule_Afternoon, Location_map } = req.body
        console.log(Time_Morning_Schedule);
        const Shedule_Morning = [{
            Time_Morning_Schedule: Time_Morning_Schedule,
            Text_Schedule_Morning: Text_Schedule_Morning
        }]
        const Shedule_Noon = [{
            Time_Noon_Schedule: Time_Noon_Schedule,
            Text_Schedule_Noon: Text_Schedule_Noon
        }]
        const Shedule_Afternoon = [{
            Time_Afternoon_Schedule: Time_Afternoon_Schedule,
            Text_Schedule_Afternoon: Text_Schedule_Afternoon
        }]
        Connection.connect().then(async (db) => {
            try {
                const Create = new Schedule(undefined, Name_Schedule, Shedule_Morning, Shedule_Noon, Shedule_Afternoon, Location_map)
                const result = await Create.CreateSchedule_Travel(db)
                if (result) return res.status(200).json({ message: 'Created Success' })
            } catch (error) {
                console.log(error);
            }
        })
    }
    UpdateSchedule_Travel(req, res, next) {
        const { id } = req.params
        const { Name_Schedule, Time_Morning_Schedule, Text_Schedule_Morning, Time_Noon_Schedule, Text_Schedule_Noon, Time_Afternoon_Schedule, Text_Schedule_Afternoon, Location_map } = req.body
        console.log(Time_Morning_Schedule);
        const Shedule_Morning = [{
            Time_Morning_Schedule: Time_Morning_Schedule,
            Text_Schedule_Morning: Text_Schedule_Morning
        }]
        const Shedule_Noon = [{
            Time_Noon_Schedule: Time_Noon_Schedule,
            Text_Schedule_Noon: Text_Schedule_Noon
        }]
        const Shedule_Afternoon = [{
            Time_Afternoon_Schedule: Time_Afternoon_Schedule,
            Text_Schedule_Afternoon: Text_Schedule_Afternoon
        }]
        Connection.connect().then(async (db) => {
            try {
                const Update = new Schedule(undefined, Name_Schedule, Shedule_Morning, Shedule_Noon, Shedule_Afternoon, Location_map)
                const result = await Update.UpdateSchedule_Travel(db, new ObjectId(id))
                if (result) return res.status(200).json({ message: 'Updated Success' })
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
                if (Delete) return res.status(200).json({ message: 'Deleted Success' })
            } catch (error) {
                console.log(error);
            }
        })
    }
}
export default new Schedule_Travel()