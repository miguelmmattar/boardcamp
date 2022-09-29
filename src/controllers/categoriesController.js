import connection from '../connection/connection.js';


function getCategories(req, res) {
    const categories = res.locals.categories;
    
    try {
        res.send(categories);
    } catch(error) {
        res.status(500).send(error.message);
    }
}

export default {
    getCategories
    /* post, */
}