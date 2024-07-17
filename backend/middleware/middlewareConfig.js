const cors = require('cors');
const express = require('express');

const middlewareConfig = (app) => {
    app.use(cors());
    app.use(express.json());
};

module.exports = { middlewareConfig };