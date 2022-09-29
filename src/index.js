import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import categoriesRouter from './routers/categoriesRouter.js';
import gamesRouter from './routers/gamesRouter.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(categoriesRouter);
app.use(gamesRouter);

app.listen(process.env.PORT_API, () => console.log('Listening on port 4000'));