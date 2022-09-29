import express from 'express';
import gamesController from '../controllers/gamesController.js';
import gamesMiddlewares from '../middlewares/gamesMiddlewares.js';

const router = express.Router();

router.get('/games', gamesMiddlewares.hasGames, gamesController.getGames);
router.post('/games', gamesMiddlewares.isValid, gamesController.postGame);

export default router;