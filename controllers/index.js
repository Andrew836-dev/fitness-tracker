const express = require("express");
const logger = require("morgan");

module.exports = app => {
    app.use(logger("dev"));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static("public"));

    require("./api-controller")(app);
    require("./html-controller")(app);
}