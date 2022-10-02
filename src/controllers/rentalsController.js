import connection from "../connection/connection.js";
import dayjs from "dayjs";

function getRentals(req, res) {
  const rentals = res.locals.rentals;

  try {
    res.send(rentals.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function postRental(req, res) {
  const { customerId, gameId, daysRented, originalPrice } =
    res.locals.newRental;
  const rentDate = dayjs().format("YYYY-MM-DD");

  try {
    await connection.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice") VALUES ($1, $2, $3, $4, $5)`,
      [customerId, gameId, rentDate, daysRented, originalPrice]
    );
    res.status(200).send("Aluguel cadastrado com sucesso!");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function finishRental(req, res) {
  const rental = res.locals.rental.rows[0];
  const returnDate = dayjs().format("YYYY-MM-DD");
  const delayFee =
    dayjs(returnDate).diff(dayjs(rental.rentDate), "day") *
    (rental.originalPrice / rental.daysRented);

  try {
    await connection.query(
      `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`,
      [returnDate, delayFee, rental.id]
    );
    res.status(200).send("Aluguel finalizado com sucesso!");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function deleteRental(req, res) {
  const rental = res.locals.rental.rows[0];

  try {
    await connection.query(`DELETE FROM rentals WHERE id = $1`, [rental.id]);
    res.status(200).send("Aluguel excluído com sucesso!");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export default {
  getRentals,
  postRental,
  finishRental,
  deleteRental,
};
