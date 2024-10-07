class Tour {
    constructor(_id, id_Schedule_Travel, id_Category, id_Service, id_Featured_Location, id_Type_Tour, Name_Tour, Price_Tour, Image_Tour, Title_Tour, Description_Tour, Start_Tour, End_Tour, total_Date) {
        this._id = _id
        this.id_Schedule_Travel = id_Schedule_Travel
        this.id_Category = id_Category
        this.id_Service = id_Service
        this.id_Featured_Location = id_Featured_Location
        this.id_Type_Tour = id_Type_Tour
        this.Name_Tour = Name_Tour
        this.Price_Tour = Price_Tour
        this.Image_Tour = Image_Tour
        this.Title_Tour = Title_Tour
        this.Description_Tour = Description_Tour
        this.Start_Tour = Start_Tour
        this.End_Tour = End_Tour
        this.total_Date = total_Date
    }
    async CreateTour(db) {
        try {

            console.log(this);
            const result_Create = await db.collection('Tours').insertOne(this)
            return result_Create
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }

    static async ShowAll(db, page, limit) {
        try {
            const ResultGetTours = await db.collection('Tours').find({})
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ Price_Tour: 1 })
                .toArray()
            const totalItems = await db.collection('Tours').countDocuments({})
            const response = ResultGetTours.map(item => new Tour(item._id, item.id_Schedule_Travel, item.id_Category, item.id_Service, item.id_Featured_Location, item.id_Type_Tour, item.Name_Tour, item.Price_Tour, item.Image_Tour, item.Title_Tour, item.Description_Tour, item.Start_Tour, item.End_Tour, item.total_Date))
            return {
                totalItems: totalItems,
                Page: page,
                TotalPages: Math.ceil(totalItems / limit),
                datas: [...response]
            }
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }

    static async Delete(db, id) {
        try {
            const Result_Delete = await db.collection('Tours').deleteOne({ _id: id })
            return Result_Delete
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }

    async UpdateTour(db, id) {
        try {
            if (id) {
                const result_Update = await db.collection('Tours').updateOne(
                    { _id: id },
                    {
                        $set: {
                            Name_Tour: this.Name_Tour,
                            Price_Tour: this.Price_Tour,
                            Image_Tour: this.Image_Tour,
                            Title_Tour: this.Title_Tour,
                            Description_Tour: this.Description_Tour,
                            Start_Tour: this.Start_Tour,
                            End_Tour: this.End_Tour,
                            total_Date: this.total_Date,
                        }
                    }
                )
                return result_Update
            }
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }

    static async Search(db, NameSearch, PriceSearch, page, limit) {
        try {
            const resultSearch = await db.collection('Tours')
                .find({
                    $and: [
                        { Price_Tour: { $gte: PriceSearch } },
                        {
                            $or: [
                                { Name_Tour: { $regex: new RegExp(NameSearch, 'i') } },
                            ]
                        },
                    ]
                })
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ Price_Tour: 1 })
                .toArray()
            const totalItems = await resultSearch.length
            return {
                totalItems: totalItems,
                Page: page,
                TotalPages: Math.ceil(totalItems / limit),
                datas: [...resultSearch]
            }
        } catch (error) {
            console.log(error);
            throw (error)
        }
    }

    static async Detail(db, id) {
        const resultDetail = await db.collection('Tours')
            .find({ _id: id })
            .sort({ Price_Tour: -1 })
            .toArray()
        return resultDetail
    }
}

export default Tour