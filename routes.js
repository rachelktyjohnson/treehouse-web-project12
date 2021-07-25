const express = require('express');
let router = express.Router();

const {User, Course} = require('./models');
const {asyncHandler} = require('./middleware/async-handler');
const {authenticateUser} = require("./middleware/auth-user");

////////////////////// USER ROUTES //////////////////////

router.get('/users', authenticateUser, asyncHandler( async (req, res)=>{
    const user = req.currentUser;

    res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        teacher: user.teacher
    });
}))

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

router.get('/courses', asyncHandler(async(req,res)=>{
    let courses = await Course.findAll({
        include:[
            {
                model: User,
                as: 'teacher',
                attributes: ['firstName', 'lastName', 'emailAddress']
            }
        ],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });
    res.status(200).json(courses);
}))

router.get('/courses/:id', asyncHandler(async(req,res)=>{
    let course = await Course.findByPk(req.params.id, {
        include: [
            {
                model: User,
                as: 'teacher',
                attributes: ['firstName', 'lastName', 'emailAddress']
            }
        ]
    });
    res.status(200).json(course);
}))

router.post('/courses', authenticateUser, asyncHandler(async (req,res)=> {
    let course = await Course.create(req.body);
    res.status(201)
        .location(`/courses/${course.id}`)
        .json({})
}))

router.put('/courses/:id', authenticateUser, asyncHandler( async (req,res) => {
    let course = await Course.findByPk(req.params.id);
    if (req.body.title){
        course.title = req.body.title;
    }
    if (req.body.description){
        course.description = req.body.description;
    }
    if (req.body.userId){
        course.userId = req.body.userId;
    }
    await course.save();
    res.status(204).json({});
}))

router.delete('/courses/:id', authenticateUser, asyncHandler(async (req,res,)=>{
    let course = await Course.findByPk(req.params.id);
    await course.destroy();
    res.status(204).json({})
}))



module.exports = router;
