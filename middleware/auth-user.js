'use strict';
const bcrypt = require('bcrypt');
const { User } = require('../models');

// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {

    let message;
    console.log(req.headers.authorization);
    // Parse the user's credentials from the Authorization header.
    const headers = req.headers.authorization.substring(6);
    const header_arr = headers.split(":");
    let credentials = {};
    credentials.email = header_arr[0];
    credentials.pass = header_arr[1];

    // If the user's credentials are available...
    // Attempt to retrieve the user from the data store
    // by their username (i.e. the user's "key"
    // from the Authorization header).
    if (credentials) {
        const user = await User.findOne({
            where:{
                emailAddress: credentials.email
            }
        })

        // If a user was successfully retrieved from the data store...
        // Use the bcrypt npm package to compare the user's password
        // (from the Authorization header) to the user's password
        // that was retrieved from the data store.
        if (user){
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);

            // If the passwords match...
            // Store the retrieved user object on the request object
            // so any middleware functions that follow this middleware function
            // will have access to the user's information.
            if (authenticated){
                req.currentUser = user;
            } else {
                message = `Authentication failure for email: ${user.emailAddress}`;
            }
        } else {
            message = `User not found for email: ${credentials.email}`;
        }
    } else {
        message = "Auth header not found";
    }

    if (message){
        // If user authentication failed...
        // Return a response with a 401 Unauthorized HTTP status code.
        console.warn(message);
        res.status(401).json({message: `Access denied: ${message}`})
    } else {
        // Or if user authentication succeeded...
        // Call the next() method.
        next();
    }
};
