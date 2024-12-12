import express from 'express';
import Admin_Statistics_Controller from '../App/Controllers/Statistics_Controller.js';
import AuthUser from '../App/MiddleWare/Decentralization/AuthUser.js';
const Router = express.Router();

Router.get('/statistics',AuthUser(["Admin", "Staff"]), Admin_Statistics_Controller.getStatistics);
Router.get('/', Admin_Statistics_Controller.getStatistics);

export default Router;
