import connection from "../connection/connection.js";

async function hasGames(req, res, next) {
    const search = `${req.query.name}%`;
    let games;
    try {
        if(!search) {
            games = await connection.query('SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;');
        } else {
            games = await connection.query(`SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE upper(games.name) LIKE upper($1);`, [search]);
        }
            
        if(!games) {
            res.status(404).send('Não foi possível encontrar nenhum jogo!');
            return;
        }

        res.locals.games = games;
    } catch(error) {
        res.status(500).send(error.message)
    }

    next();
}

async function isValid(req, res, next) {
    const newGame = req.body;

    try {
        if(newGame.name === '' || newGame.stockTotal <= 0 || newGame.pricePerDay <= 0) {
            return res.status(400).send('Preencha os campos com informações válidas!');
        }

        const games = await connection.query('SELECT * FROM games;');
        const sameGame = games.rows.find(item => item.name === newGame);

        if(sameGame) {
            return res.status(409).send('Este jogo já está cadastrado!');
        }

    res.locals.newGame = newGame;

    } catch(error) {
        res.status(500).send(error.message)
    }

    next();
}

export default {
    hasGames,
    isValid
}