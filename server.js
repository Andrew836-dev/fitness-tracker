const express = require("express");
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost/workout";
const PORT = process.env.PORT || 3000;
const app = express();

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

require("./controllers")(app);

app.listen(PORT, () => {
    console.log("Listening on https://localhost:" + PORT);
});