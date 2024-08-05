const mongoose = require("mongoose");

const connectDb = () => {
  return mongoose
    .connect(process.env.DB_URL_LOCAL)
    .then((data) => {
      console.log(`Mongodb connect with server : ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDb;

