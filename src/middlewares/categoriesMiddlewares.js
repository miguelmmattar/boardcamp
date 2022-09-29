import connection from "../connection/connection.js";

async function hasCategories(req, res, next) {
    try {
        const categories = await connection.query('SELECT * FROM categories');
        if(!categories) {
            res.status(404).send('Não foi possível encontrar esta categoria!');
            return;
        }

        res.locals.categories = categories;
    } catch(error) {
        res.status(500).send(error.message)
    }

    next();
}

export {
    hasCategories
}