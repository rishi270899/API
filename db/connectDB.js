const mongoose = require("mongoose");

const connectDb = () => {
  return mongoose
    .connect(process.env.live_url)
    .then((data) => {
      console.log(`Mongodb connect with server : ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDb;

