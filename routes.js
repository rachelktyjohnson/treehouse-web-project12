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
    const user = req.currentUser;

    res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        teacher: user.teacher
    });
}))

//POST route '/api/users'
//create a new user
//set Location header to '/'
//return 201 HTTP status code and no content
router.post('/users', authenticateUser, asyncHandler( async (req,res) => {
    try{
        await User.create(req.body);
        res.status(201).location('/').json({});
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }

}))


////////////////////// COURSE ROUTES //////////////////////








module.exports = router;
