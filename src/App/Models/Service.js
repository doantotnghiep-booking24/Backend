class Service {
    constructor(_id, Name_Service, Price_Service) {
        this._id = _id
        this.Name_Service = Name_Service
        this.Price_Service = Price_Service
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
    static async FindService(db,Name_Service){
        try {
            const resultCheck = await db.collection('Services').findOne({Name_Service : Name_Service})
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
                            Name_Service: this.Name_Service,
                            Price_Service: this.Price_Service
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
            const result_Delete = await db.collection('Services')
                .deleteOne({ _id: id })
            return result_Delete
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}
export default Service
