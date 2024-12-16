import express from 'express'
import Voucher_Controller from '../App/Controllers/Voucher_Controller.js'
import AuthUser from '../App/MiddleWare/Decentralization/AuthUser.js'
import Auth from '../App/MiddleWare/Jwt/Auth.js'
const Router = express.Router()
Router.get('/GetAllVoucher', Voucher_Controller.GetAllVoucher) // http://localhost:3001/Vouchers/GetAllVoucher
Router.post('/CreateVoucher',Auth.verifyJWTToken, AuthUser(["Admin"]), Voucher_Controller.CreateVoucher) // http://localhost:3001/Vouchers/CreateVoucher 
Router.post('/UpdateVoucher/:id',Auth.verifyJWTToken, AuthUser(["Admin"]), Voucher_Controller.UpdateVoucher) // http://localhost:3001/Vouchers/UpdateVoucher/id
Router.post('/DeleteVoucher/:id',Auth.verifyJWTToken, AuthUser(["Admin"]), Voucher_Controller.DeleteVoucher) // http://localhost:3001/Vouchers/DeleteVoucher/id
Router.post('/RemoveVoucher/:id',Auth.verifyJWTToken, AuthUser(["Admin"]), Voucher_Controller.RemoveVoucher) // http://localhost:3001/Vouchers/DeleteVoucher/id
Router.post('/RestoreVoucher/:id',Auth.verifyJWTToken, AuthUser(["Admin"]), Voucher_Controller.RemoveVoucher) // http://localhost:3001/Vouchers/DeleteVoucher/id
Router.get('/', Voucher_Controller.GetAllVoucher)


export default Router   