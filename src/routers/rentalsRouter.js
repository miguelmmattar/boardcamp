import express from 'express';
import rentalsController from '../controllers/rentalsController.js';
import rentalsMiddlewares from '../middlewares/rentalsMiddlewares.js';

const router = express.Router();

router.get('/rentals', rentalsMiddlewares.hasRentals, rentalsController.getRentals);
router.post('/rentals', rentalsMiddlewares.isValid, rentalsMiddlewares.rentalSchema, rentalsController.postRental);
router.post('/rentals/:id/return', rentalsMiddlewares.isRental, rentalsMiddlewares.isFinished, rentalsController.finishRental);
router.delete('/rentals/:id', rentalsMiddlewares.isRental,  rentalsMiddlewares.isFinished, rentalsController.deleteRental);

export default router;