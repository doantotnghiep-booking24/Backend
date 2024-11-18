import express from 'express';
import Admin_Statistics_Controller from '../App/Controllers/Statistics_Controller.js';

const Router = express.Router();

Router.get('/statistics', Admin_Statistics_Controller.getStatistics);
Router.get('/', Admin_Statistics_Controller.getStatistics);

export default Router;
