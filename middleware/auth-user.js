'use strict';
const bcrypt = require('bcrypt');
const auth = require('basic-auth');
const { User, Course } = require('../models');

// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {

    let message;
    if (req.headers.authorization) {
        let credentials;
        if (req.headers.authorization.includes(':')){
            const headers = req.headers.authorization.substring(6);
            const header_arr = headers.split(":");
            credentials = {};
            credentials.name = header_arr[0];
            credentials.pass = header_arr[1];
        } else {
            // Parse the user's credentials from the Authorization header.
            credentials = auth(req);
        }


        // If the user's credentials are available...
        // Attempt to retrieve the user from the data store
        // by their username (i.e. the user's "key"
        // from the Authorization header).
        if (credentials) {
            const user = await User.findOne({
                where: {
                    emailAddress: credentials.name
                },
                include: [
                    {
                        model: Course,
                        as: 'teacher',
                        attributes: ['title', 'description', 'estimatedTime', 'materialsNeeded']
                    }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            })

            // If a user was successfully retrieved from the data store...
            // Use the bcrypt npm package to compare the user's password
            // (from the Authorization header) to the user's password
            // that was retrieved from the data store.
            if (user) {
                const authenticated = bcrypt.compareSync(credentials.pass, user.password);

                // If the passwords match...
                // Store the retrieved user object on the request object
                // so any middleware functions that follow this middleware function
                // will have access to the user's information.
                if (authenticated) {
                    req.currentUser = user;
                } else {
                    message = `Authentication failure for email: ${user.emailAddress}`;
                }
            } else {
                message = `User not found for email: ${credentials.name}`;
            }
        } else {
            message = "Auth header not found";
        }
    } else {
    message = "Auth header not found";
}

    if (message) {
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
