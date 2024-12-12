class TimeSchedules {
    constructor(_id, TimeSchedule) {
            this._id = _id
            this.TimeSchedule = TimeSchedule
    }
    static async getAll(db) {
        try {
            const result = await db.collection('TimeSchedules')
                .find({})
                .toArray()
            return result
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }
    async Create(db) {
        try {
            const CreateTime = db.collection('TimeSchedules').insertOne(this)
            return CreateTime
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }
    static async Update(db, id) {
        try {
            const Update = db.collection('TimeSchedules')
                .updateOne({ _id: id }, {
                    $set: {
                        TimeSchedule: this.TimeSchedule
                    }
                })
            return Update
        } catch (error) {

        }
    }
}
export default TimeSchedules