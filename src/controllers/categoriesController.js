import connection from '../connection/connection.js';


function getCategories(req, res) {
    const categories = res.locals.categories;
    
    try {
        res.send(categories.rows);
    } catch(error) {
        res.status(500).send(error.message);
    }
}

async function postCategory(req, res) {
    const newCategory = res.locals.newCategory;

    try {
        await connection.query(`INSERT INTO categories (name) VALUES ($1)`, [newCategory.name]);
        res.status(200).send('Categoria criada com sucesso!');
    } catch(error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

export default {
    getCategories,
    postCategory
}