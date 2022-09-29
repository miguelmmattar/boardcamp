import express from 'express';
import categoriesController from '../controllers/categoriesController.js';
import categoriesMiddlewares from '../middlewares/categoriesMiddlewares.js';

const router = express.Router();

router.get('/categories', categoriesMiddlewares.hasCategories, categoriesController.getCategories);
router.post('/categories', categoriesMiddlewares.isValid, categoriesController.postCategory);

export default router;