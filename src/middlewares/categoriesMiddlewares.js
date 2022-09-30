import connection from "../connection/connection.js";

async function hasCategories(req, res, next) {
    try {
        const categories = await connection.query('SELECT * FROM categories;');
        if(!categories) {
            res.status(404).send('Não foi possível encontrar nenhuma categoria!');
            return;
        }

        res.locals.categories = categories;
    } catch(error) {
        res.status(500).send(error.message)
    }

    next();
}

async function isValid(req, res, next) {
    const newCategory = req.body;

    try {
        if(newCategory.name === '') {
            return res.status(400).send('O nome da categoria não pode estar em branco!');
        }

        const categories = await connection.query('SELECT * FROM categories;');
        const sameCategory = categories.rows.find(item => item.name === newCategory.name);

        if(sameCategory) {
            return res.status(409).send('Esta categoria já existe!');
        }

    res.locals.newCategory = newCategory;

    } catch(error) {
        res.status(500).send(error.message)
    }

    next();
}

export default {
    hasCategories,
    isValid
}