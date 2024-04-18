const path = require("path");
// used to handle directory paths 
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const bodyParser = require("body-parser");

const errorHandler = require("./middlewares/errorHandler");
const passportJWT = require('./middlewares/passportJWT')();

const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const followRoutes = require("./routes/follow");

const app = express();
app.use(cors());

//rate limiter to prevent ddos attacks or prevent spamming of requests.
const limiter = rateLimit({
	windowMs: 10 * 1000, //15 seconds
	limit: 5, //10 requests per windowms
    max: 5 //limit each ip to 10 req per windowms
});
app.use(limiter)

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/rest-api-node', { useNewUrlParser: true})

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(passportJWT.initialize());
app.use("/api/post", passportJWT.authenticate(), postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/follow", passportJWT.authenticate(), followRoutes);
app.use(errorHandler);
app.listen(8000, ()=>{
    console.log("Listening");
});