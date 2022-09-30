import express from 'express';
import customersController from '../controllers/customersController.js';
import customersMiddlewares from '../middlewares/customersMiddlewares.js';

const router = express.Router();

router.get('/customers', customersMiddlewares.hasCustomers, customersController.getCustomers);
router.get('/customers/:id', customersMiddlewares.isCustomer, customersController.getCustomer);
router.post('/customers', customersMiddlewares.isValid, customersMiddlewares.customerSchema, customersController.postCustomer);
router.put('/customers/:id', customersMiddlewares.isCustomer, customersMiddlewares.customerSchema, customersController.putCustomer);

export default router;