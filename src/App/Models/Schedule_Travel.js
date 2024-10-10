class Schedule_Travel {
    constructor(_id, Name_Schedule, Departure_Time, Location, means_of_transport, Work) {
        this._id = _id
        this.Name_Schedule = Name_Schedule
        this.Departure_Time = Departure_Time
        this.Location = Location
        this.means_of_transport = means_of_transport
        this.Work = Work
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
                        Departure_Time: this.Departure_Time,
                        Location: this.Location,
                        means_of_transport: this.means_of_transport,
                        Work: this.Work,
                        Name_Schedule: this.Name_Schedule
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