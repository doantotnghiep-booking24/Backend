import Connection from '../../Config/db/index.js'
import Voucher from '../Models/Voucher.js';
import { ObjectId } from 'mongodb';
class Voucher_Controller {
    GetAllVoucher(req, res, next) {
        Connection.connect().then(async (db) => {
            try {
                const AllVoucher = await Voucher.getAll(db)
                if (AllVoucher) return res.status(200).send({ Voucher: AllVoucher })
            } catch (error) {
                console.log(error);
            }
        })
    }
    CreateVoucher(req, res, next) {
        let { Code_Voucher, Description, Discount, Type, Start_Date, End_Date, Max_Usage, Condition } = req.body
        let isexpired = true
        const result_split = Condition.split(',')
        const obj_Condition = {
            Name_tour: "",
            Min_tour_value: 0,
            Tour_categories: ""
        }
        obj_Condition.Name_tour = result_split[0]
        obj_Condition.Min_tour_value = parseInt(result_split[1])
        obj_Condition.Tour_categories = result_split[2]
        Condition = obj_Condition
        Connection.connect().then(async (db) => {
            const CheckIsVoucher = await Voucher.FindVoucher(db, Code_Voucher)
            if (!CheckIsVoucher) {
                const CreateVoucher = new Voucher(undefined, Code_Voucher, Description, parseInt(Discount), Type, Start_Date, End_Date, Max_Usage, Condition, isexpired)
                const result = await CreateVoucher.Create(db)
                if (result) return res.status(200).send({ message: 'Create Success' })
            } else {
                return res.status(400).send({ message: 'Name Voucher is already exist' })
            }
        })
    }
    UpdateVoucher(req, res, next) {
        const { id } = req.params
        const { Code_Voucher, Description, Discount, Type, Start_Date, End_Date, Max_Usage, Condition } = req.body
        Connection.connect().then(async (db) => {
            try {
                const UpdateVoucher = new Voucher(undefined, Code_Voucher, Description, Discount, Type, Start_Date, End_Date, Max_Usage, Condition)
                const result = await UpdateVoucher.Update(db, new ObjectId(id))
                if (result) return res.status(200).send({ message: 'Update Success' })
            } catch (error) {
                console.log(error);
            }
        })
    }
    DeleteVoucher(req, res, next) {
        const { id } = req.params
        Connection.connect().then(async (db) => {
            try {
                const DeleteVoucher = Voucher.Delete(db, new ObjectId(id))
                if (DeleteVoucher) return res.status(200).send({ message: 'Delete Success' })
            } catch (error) {
                console.log(error);
            }
        })
    }
}
export default new Voucher_Controller()