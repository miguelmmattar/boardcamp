import connection from "../connection/connection.js";
import joi from 'joi';

async function hasCustomers(req, res, next) {
    let search = req.query.cpf;
    let customers;
    try {
        if(!search) {
            customers = await connection.query('SELECT * FROM customers;');
        } else {
            search = `${search}%`;
            games = await connection.query(`SELECT * FROM games WHERE customers.cpf LIKE $1;`, [search]);
        }
        
        if(!customers) {
            res.status(404).send('Não foi possível encontrar nenhum cliente!');
            return;
        }

        res.locals.customers = customers;
    } catch(error) {
        res.status(500).send(error.message)
    }

    next();
}

async function isClient(req, res) {
    const { id } = req.params;

    try {
        const customer = await connection.query(`SELECT * FROM customers WHERE id = $1`, [id]);
        if(!customer) {
            res.status(404).send('Este cliente não esta cadastrado!');
            return;
        }
        res.locals.customer = customer.rows;

    } catch(error) {
        res.status(500).send(error.message)
    }

    next();
}

function customerSchema(req, res, next) {
    const schema = joi.object({
        name: joi.string().empty().required(),
        phone: joi.string().pattern(/^[0-9]+$/, 'numbers').min(10).max(11).required(),
        cpf: joi.string().pattern(/^[0-9]+$/, 'numbers').length(11).required(),
        birthday: joi.string().isoDate()
    });

    const validation = schema.validate(req.body, { abortEarly: false });
 
    if(validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(400).send(errors);
    }

    next();
}

async function isValid(req, res, next) {
    const newCustomer = req.body;

    try {
        const customers = await connection.query('SELECT * FROM customers;');
        const sameCustomer = customers.rows.find(item => item.cpf === newCustomer.cpf);

        if(sameCustomer) {
            return res.status(409).send('Este cliente já está cadastrado!');
        }

    res.locals.newCustomer = newCustomer;

    } catch(error) {
        res.status(500).send(error.message)
    }

    next();
}

async function isCustomer(req, res, next) {
    let { id } = req.params;
    try {
        if(!id) {
            res.status(404).send('Não foi possível encontrar este cliente!');
            return;
        }

        const customer = await connection.query(`SELECT * FROM customers WHERE id = $1`, [id])

        res.locals.customer = customer;
    } catch(error) {
        res.status(500).send(error.message)
    }

    next();
}

export default {
    hasCustomers,
    customerSchema,
    isValid,
    isCustomer
}