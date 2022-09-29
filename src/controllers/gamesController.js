import connection from '../connection/connection.js';


function getGames(req, res) {
    const games = res.locals.games;
    
    try {
        res.send(games.rows);
    } catch(error) {
        res.status(500).send(error.message);
    }
}

async function postGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = res.locals.newGame;

    try {
        await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`, [name, image, stockTotal, categoryId, pricePerDay ]);
        res.status(200).send('Jogo criado com sucesso!');
    } catch(error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

export default {
    getGames,
    postGame
}