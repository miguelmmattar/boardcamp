import express from 'express';
import categoriesController from '../controllers/categoriesController.js';
import * as categoriesMiddlewares from '../middlewares/categoriesMiddlewares.js';

const router = express.Router();
router.use(categoriesMiddlewares.hasCategories);

router.get('/categories', categoriesController.getCategories);

export default router;