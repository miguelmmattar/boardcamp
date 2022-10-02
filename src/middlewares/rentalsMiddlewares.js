import connection from "../connection/connection.js";
import joi from "joi";

async function hasRentals(req, res, next) {
  const { customerId, gameId } = req.query;
  let rentals; 

  try {
    //rodar apenas uma vez:
    //await connection.query("CREATE TYPE customer AS (id int, name text)");
    //await connection.query("CREATE TYPE game AS (id int, name text, categoryId int, categoryName text)");

    if (!customerId && !gameId) {
      rentals = await connection.query(
        `SELECT rentals.*, to_json(row(customers.id, customers.name)::customer) AS customer, to_json(row(games.id, games.name, games."categoryId", categories.name)::game) AS games FROM customers JOIN rentals ON customers.id = rentals."customerId" JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id;`
      );
    }

    if (customerId && !gameId) {
      rentals = await connection.query(
        `SELECT rentals.*, to_json(row(customers.id, customers.name)::customer) AS customer, to_json(row(games.id, games.name, games."categoryId", categories.name)::game) AS games FROM customers JOIN rentals ON customers.id = rentals."customerId" JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE customers.id = $1;`,
        [customerId]
      );
    }

    if (!customerId && gameId) {
      rentals = await connection.query(
        `SELECT rentals.*, to_json(row(customers.id, customers.name)::customer) AS customer, to_json(row(games.id, games.name, games."categoryId", categories.name)::game) AS games FROM customers JOIN rentals ON customers.id = rentals."customerId" JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE games.id = $1;`,
        [gameId]
      );
    }

    if (customerId && gameId) {
      rentals = await connection.query(
        `SELECT rentals.*, to_json(row(customers.id, customers.name)::customer) AS customer, to_json(row(games.id, games.name, games."categoryId", categories.name)::game) AS games FROM customers JOIN rentals ON customers.id = rentals."customerId" JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE customers.id = $1 AND games.id = $2;`,
        [customerId, gameId]
      );
    }

    if (!rentals) {
      res.status(404).send("Não foi possível encontrar nenhum cliente!");
      return;
    }

    res.locals.rentals = rentals;
  } catch (error) {
    res.status(500).send(error.message);
  }

  next();
}

function rentalSchema(req, res, next) {
  const schema = joi.object({
    customerId: joi.number().empty().min(1).required(),
    gameId: joi.number().empty().min(1).required(),
    daysRented: joi.number().empty().min(1).required(),
  });

  const validation = schema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }

  next();
}

async function isValid(req, res, next) {
  let newRental = req.body;

  try {
    if (!newRental) {
      return res.sendStatus(201);
    }

    const customers = await connection.query("SELECT id FROM customers;");
    const sameCustomer = customers.rows.find(
      (item) => item.id === newRental.customerId
    );

    if (!sameCustomer) {
      return res.status(400).send("Este cliente não está cadastrado!");
    }

    const games = await connection.query(
      'SELECT id, "stockTotal", "pricePerDay" FROM games;'
    );
    const sameGame = games.rows.find((item) => item.id === newRental.gameId);

    if (!sameGame) {
      return res.status(400).send("Este jogo não está cadastrado!");
    }

    newRental = {
      ...newRental,
      originalPrice: sameGame.pricePerDay * newRental.daysRented,
    };

    const rentals = await connection.query('SELECT "gameId" FROM rentals;');
    const inStock =
      sameGame.stockTotal -
      rentals.rows.filter(
        (item) => item.id === newRental.gameId && !item.returnDate
      ).length;

    if (inStock === 0) {
      return res
        .status(400)
        .send("Não temos mais volumes disponíveis deste jogo!");
    }

    res.locals.newRental = newRental;
  } catch (error) {
    res.status(500).send(error.message);
  }

  next();
}

async function isRental(req, res, next) {
  let { id } = req.params;
  try {
    const rental = await connection.query(
      `SELECT * FROM rentals WHERE id = $1`,
      [id]
    );

    if (!rental) {
      res.status(404).send("Não foi possível encontrar este aluguel!");
      return;
    }

    res.locals.rental = rental;
  } catch (error) {
    res.status(500).send(error.message);
  }

  next();
}

async function isFinished(req, res, next) {
  const path = req.path;
  let { id } = req.params;

  try {
    const rental = await connection.query(
      `SELECT "returnDate" FROM rentals WHERE id = $1`,
      [id]
    );

    if (path.includes("return")) {
      if (rental.rows[0].returnDate) {
        res.status(404).send("Este aluguel já foi finalizado!");
        return;
      }
    } else {
      if (!rental.rows[0].returnDate) {
        res.status(404).send("Este aluguel ainda não foi finalizado!");
        return;
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }

  next();
}

export default {
  hasRentals,
  rentalSchema,
  isValid,
  isRental,
  isFinished
};
