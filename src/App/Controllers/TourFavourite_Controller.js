import Connection from '../../Config/db/index.js'
import TourFavourite from '../Models/TourFavourite.js';
import { ObjectId } from 'mongodb';
class TourFavourite_Controller {
    GetAllTourFavourite(req, res, next) {
        Connection.connect().then(async (db) => {
            try {
                const AllTourFavourite = await TourFavourite.getAll(db)
                if (AllTourFavourite) return res.status(200).json({ TourFavourite: AllTourFavourite })
            } catch (error) {
                console.log(error);
            }
        })
    }
    CreateTourFavourite(req, res, next) {
        const { id_user, id } = req.body
        let result
        let id_User = id_user
        let id_Tour = id
        let isCheckFavourite
        Connection.connect().then(async (db) => {
            const CheckIsTourFavourite = await TourFavourite.FindTourFav(db, id_Tour)
            const resCheck = CheckIsTourFavourite.some(checkFav => {
                return checkFav.id_User.includes(id_User) && checkFav.id_Tour.includes(id_Tour)
            })
            if (!resCheck) {
                const CreateTourFavourite = new TourFavourite(undefined, id_User, id_Tour, isCheckFavourite = true)
                result = await CreateTourFavourite.Create(db)
                console.log('khong tồn tại');
                if (result) return res.status(200).json({ message: 'Create Success', result: result.insertedId })
            } else {
                console.log('đã tồn tại');
                const response = await db.collection('TourFavourites').find({}).toArray()
                const resFilter = response.filter(res_Fav => {
                    return res_Fav.id_User.includes(id_User) && res_Fav.id_Tour.includes(id_Tour)
                })

                if (resFilter) {
                    const CancleTourFavourite = TourFavourite.Delete(db, new ObjectId(resFilter[0]._id))
                    if (CancleTourFavourite) return res.status(200).json({ message: 'Create Success' })
                }
            }
            return res.status(400).json({ message: 'Failed Create' })
        })
    }
    CancleFavourite(req, res, next) {
        const { id } = req.params

        Connection.connect().then(async (db) => {
            try {
                const CancleTourFavourite = TourFavourite.Delete(db, new ObjectId(id))
                if (CancleTourFavourite) return res.status(200).json({ message: 'Cancle Success' })
            } catch (error) {
                console.log(error);
            }
        })
    }
}
export default new TourFavourite_Controller()