const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const PORT =5000;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    const accessToken = req.session.accessToken;
    if(!accessToken){
        return res.status(401).json({message: 'Access denied. No access token provided.'});
    }
    try{
        const decoded = jwt.verify(token, 'your_secret_key');
        req.user = decoded;
        next();
    }
    catch(ex){
        res.status(400).json({message: 'Invalid access token.'});
    }
});
 


app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
