class Schedule_Travel {
    constructor(_id,Name_Schedule,Location_map, Shedule_Morning, Shedule_Noon, Shedule_Afternoon) {
        this._id = _id
        this.Name_Schedule = Name_Schedule
        this.Location_map = Location_map
        this.Shedule_Morning = Shedule_Morning
        this.Shedule_Noon = Shedule_Noon
        this.Shedule_Afternoon = Shedule_Afternoon
    }
    static async GetSchedule_Travel(db) {
        try {
            const result_Schedule_Travel = await db.collection('Schedule_Travels')
                .find({})
                .toArray()
            return result_Schedule_Travel
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async CreateSchedule_Travel(db) {
        try {
            const result_Create = await db.collection('Schedule_Travels')
                .insertOne(this)
            return result_Create
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async UpdateSchedule_Travel(db, id) {
        try {
            const result_Update = await db.collection('Schedule_Travels').updateOne(
                { _id: id },
                {
                    $set: {
                        Name_Schedule : this.Name_Schedule,
                        Location_map: this.Location_map,
                        Shedule_Morning: this.Shedule_Morning,
                        Shedule_Noon: this.Shedule_Noon,
                        Shedule_Afternoon: this.Shedule_Afternoon,
                    }
                }
            )
            return result_Update
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    static async DeleteSchedule_Travel(db, id) {
        try {
            const result_Delete = await db.collection('Schedule_Travels')
                .deleteOne({ _id: id })
            return result_Delete
        } catch (error) {
            console.log(error);
            throw error
        }
    }

}
export default Schedule_Travel
