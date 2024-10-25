class Schedule_Travel {
    constructor(_id, Name_Schedule, Location, means_of_transport) {
        this._id = _id
        this.Location = Location
        this.means_of_transport = means_of_transport
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
                        Location: this.Location,
                        means_of_transport: this.means_of_transport,
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