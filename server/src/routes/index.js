import express from 'express';
import authRoute from './authRoute.js'
import employeeRoute from './employeeRoute.js'
import adminRoute from './adminRoute.js'

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', employeeRoute);
router.use('/admin', adminRoute);

export default router;