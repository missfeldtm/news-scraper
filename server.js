const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');

const express = require("express");
const app = express();


app.use(logger("dev"));
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(express.static(process.cwd() + "/public"));
//handlebars set up
const exphbs = require("express-handlebars");
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

//set up mongoDB
const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost/news-scraper";
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Connected to Mongoose!");
});

// //routes
const routes = require("./controller/controller.js");
 app.use("/", routes);

//local host connection
var port = process.env.PORT || 3000;
app.listen(port, () =>
    console.log("listening on PORT" + port)
)