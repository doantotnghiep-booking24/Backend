import express from 'express'
import Voucher_Controller from '../App/Controllers/Voucher_Controller.js'
const Router = express.Router()
Router.get('/GetAllVoucher',Voucher_Controller.GetAllVoucher) // http://localhost:3001/Vouchers/GetAllVoucher
Router.post('/CreateVoucher',Voucher_Controller.CreateVoucher) // http://localhost:3001/Vouchers/CreateVoucher 
Router.post('/UpdateVoucher/:id',Voucher_Controller.UpdateVoucher) // http://localhost:3001/Vouchers/UpdateVoucher/id
Router.post('/DeleteVoucher/:id',Voucher_Controller.DeleteVoucher) // http://localhost:3001/Vouchers/DeleteVoucher/id
Router.get('/',Voucher_Controller.GetAllVoucher)


export default Router