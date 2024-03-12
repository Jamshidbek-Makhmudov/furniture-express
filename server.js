const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const connectionString = process.env.MONGO_URL;

mongoose.set("strictQuery", false);
mongoose.connect(
  connectionString,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("Error on connecting to mongoose");
    } else {
      console.log("Mongoose connection successful");
      // console.log(goose);

      const server = require("./app");
      const port = process.env.PORT || 3002;
      server.listen(port, () => {
        console.log(
          `Server is running on port ${port}, http://localhost:${port}`
        );
      });
    }
  }
);
