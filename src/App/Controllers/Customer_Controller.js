import Connection from '../../Config/db/index.js'
import Custommers from '../Models/Custommers.js';
import { ObjectId } from 'mongodb';
class Custommer_Controller {
    GetCustommers(req, res, next) {
        const {id} = req.params
        Connection.connect().then(async (db) => {
            try {
                const Custommer = await Custommers.getCus(db)
                if(Custommer){
                    return res.status(200).json({ Custommer: Custommer })
                }
            } catch (error) {
                console.log(error);
            }
        })
    }

}
export default new Custommer_Controller()
