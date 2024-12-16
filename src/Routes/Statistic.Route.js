import express from 'express';
import Admin_Statistics_Controller from '../App/Controllers/Statistics_Controller.js';
import AuthUser from '../App/MiddleWare/Decentralization/AuthUser.js';
import Auth from '../App/MiddleWare/Jwt/Auth.js';
const Router = express.Router();

Router.get('/statistics',Auth.verifyJWTToken, AuthUser(["Admin", "Staff"]), Admin_Statistics_Controller.getStatistics);
Router.get('/', Admin_Statistics_Controller.getStatistics);

export default Router;
