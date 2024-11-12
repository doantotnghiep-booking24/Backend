class Service {
    constructor(_id, NameService, isDeleted = false) {
        this._id = _id
        this.NameService = NameService
        this.isDeleted = isDeleted
    }

    static async GetServices(db) {
        try {
            const result_GetServices = await db.collection('Services')
                .find({})
                .toArray()
            return result_GetServices
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    static async FindService(db, NameService) {
        try {
            const resultCheck = await db.collection('Services').findOne({ NameService: NameService })
            return resultCheck ? true : false
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async CreateServices(db) {
        try {
            const result_Create = await db.collection('Services')
                .insertOne(this)
            return result_Create
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async UpdateService(db, id) {
        try {
            const result_Update = await db.collection('Services').updateOne(
                { _id: id },
                {
                    $set: {
                        NameService: this.NameService
                    }
                }
            )
            return result_Update
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    static async DeleteService(db, id) {
        try {
            const reuslt_Delete = await db.collection('Services')
                .deleteOne({ _id: id })
            return reuslt_Delete
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    static async RemoveService(db, id) {
        try {
            let reuslt_Delete;
            const findIsDeleted = await db.collection('Services').findOne({ _id: id });
            if (findIsDeleted.isDeleted === true) {
                reuslt_Delete = await db.collection('Services').updateOne({ _id: id }, {
                    $set: { isDeleted: false }
                })
            } else {
                reuslt_Delete = await db.collection('Services').updateOne({ _id: id }, {
                    $set: { isDeleted: true }
                })
            }

            return reuslt_Delete
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}
export default Service