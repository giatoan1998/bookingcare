import express from "express";

let configViewEngine = (app) => {
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs");
    // ejs tuong duong voi blade trong php...de code js trong file HTML...
    app.set("views", "./src/views");
}

module.exports = configViewEngine;