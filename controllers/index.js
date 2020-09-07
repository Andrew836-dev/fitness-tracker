const express = require("express");
const logger = require("morgan");

module.exports = app => {
    if(process.env.NODE_ENV !== "test"){
        app.use(logger("dev"));
    }
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    require("./api-controller")(app);

    app.use(express.static("public"));
    require("./html-controller")(app);
}