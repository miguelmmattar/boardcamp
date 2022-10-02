import connection from '../connection/connection.js';


function getCustomers(req, res) {
    const customers = res.locals.customers;
    
    try {
        res.send(customers.rows);
    } catch(error) {
        res.status(500).send(error.message);
    }
}

function getCustomer(req, res) {
    const customer = res.locals.customer;
    
    try {
        res.send(customer.rows[0]);
    } catch(error) {
        res.status(500).send(error.message);
    }
}

async function postCustomer(req, res) {
    const { name, phone, cpf, birthday } = res.locals.newCustomer;

    try {
        await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday]);
        res.status(200).send('Cliente cadastrado com sucesso!');
    } catch(error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

async function putCustomer(req, res) {
    const customer = res.locals.customer;
    const { name, phone, cpf, birthday } = req.body;
    const { id } = customer.rows[0];

    try {
        await connection.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`, [name, phone, cpf, birthday, id]);
        res.status(200).send('Cliente atualizado com sucesso!');
    } catch(error) {
        res.status(500).send(error.message);
    }
}

export default {
    getCustomers,
    getCustomer,
    postCustomer,
    putCustomer
}