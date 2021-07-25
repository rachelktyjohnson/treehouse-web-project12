const express = require('express');
let router = express.Router();

const {User, Course} = require('./models');
const {asyncHandler} = require('./middleware/async-handler');
const {authenticateUser} = require("./middleware/auth-user");

////////////////////// USER ROUTES //////////////////////

//GET route '/api/users'
//return all properties and values for the currently authenticated User
//return 200 HTTP status code
router.get('/users', authenticateUser, asyncHandler( async (req, res)=>{
    res.json(req.currentUser);
}))


////////////////////// COURSE ROUTES //////////////////////








module.exports = router;
