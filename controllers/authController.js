const jwt = require("jwt-simple");
const config = require("../config");
//const redisClient = require("../config/redis").getClient();

const User = require("../models/user");
const validationHandler = require("../validations/validationHandler");
const passportJWT = require("../middlewares/passportJWT");


exports.login = async (req, res, next) =>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({email}).select("+password");
        if(!user){
            const error = new Error("Wrong Credentials");
            error.statusCode = 401;
            throw error;
            
        }
        const validPassword = await user.validPassword(password);
        if(!validPassword){
            const error = new Error("Wrong Credentials");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.encode({id: user.id}, config.jwtSecret);
        console.log(user.name+"  LOGGED IN");        
        return res.send({user, token});


    }catch(err){
        next(err);
    }
};

exports.signup = async (req, res, next)=>{
    try{
        validationHandler(req);
        const existingUser = await User.findOne({email:req.body.email});
        if(existingUser){
            const error = new Error("Email already used");
            error.statusCode = 403;
            throw error;
        }

        let user = new User();
        user.email = req.body.email;
       // user.password = await user.encryptPassword(req.body.password);
        user.password = await user.encryptPassword(req.body.password);
        user.name = req.body.name;
        user = await user.save();
        const token = jwt.encode({id: user.id}, config.jwtSecret);
        return res.send({user, token});
    }catch(err){
        next(err);
    }
};


exports.me = async (req, res, next) =>{
    try{

        const usertoken = req.headers.authorization;
        const token = usertoken.split(" ");
        const userfromtoken = jwt.decode(token[1], config.jwtSecret);

        //code for redis Linux/WSL:

        /*const cacheValue = await redisClient.get("users", userfromtoken.id);
        if(cacheValue){
            console.log("getting from redis");
            //redis stored text therefore parse as JSON.
            const doc = JSON.parse(cacheValue);
            //create new mongoose objects
            const cacheUser = new User(doc);
            return res.send(cacheUser);
        } */
        //console.log("getting from database");
        const user = await User.findById(userfromtoken.id);
        //add to cache (redis database)
        //redisClient.set("users", user.id, JSON.stringify(user));
        return res.send(user);
    }catch(err){
        next(err);
    }
};