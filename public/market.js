#!/usr/bin/env nodejs
const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, "")));
app.all('/*', function (req, res) {
   res.sendFile(path.join(__dirname, 'index.html'));
 });
app.listen(6969);