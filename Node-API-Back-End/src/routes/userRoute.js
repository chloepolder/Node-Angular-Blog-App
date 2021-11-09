"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
var express_1 = __importDefault(require("express"));
var users_1 = require("../models/users");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var posts_1 = require("../models/posts");
var userRouter = express_1.default.Router();
exports.userRouter = userRouter;
var userArray = [];
userArray.push(new users_1.Users("jsnow", "Jon", "Snow", "jsnow@gmail.com", "12345"));
userArray.push(new users_1.Users("kzoldyk", "Killua", "Zoldyck", "kzoldyk@gmail.com", "abcde"));
userArray.push(new users_1.Users("pmcCartney", "Paul", "McCartney", "pmccartney@gmail.com", "123abc"));
userRouter.get("/", function (req, res, next) {
    //get request for 'localhost(3000)/Users/
    res.status(200).send(userArray); //200 OK success status
});
userRouter.post("/", function (req, res, next) {
    //post request for 'localhost(3000)/Users/
    if (req.body.userId && req.body.firstName && req.body.lastName && req.body.emailAddress && req.body.password && validateEmail(req.body.emailAddress) === true) {
        //genSalt - generates a salt:unique, random characters to combine with password characters
        bcrypt_1.default.genSalt(10, function (err, salt) {
            //hash - encrypts the salted password
            bcrypt_1.default.hash(req.body.password, salt, function (err, hash) {
                // Store hash in your password DB.
                var newUser = userArray.find(function (u) { return u.userId.toLowerCase() === req.body.userId.toLowerCase(); });
                if (newUser != undefined) {
                    res.status(409).send({ message: 'Duplicate userId', status: 409 });
                }
                else if (req.body.userId && req.body.firstName && req.body.lastName && req.body.emailAddress) {
                    newUser = new users_1.Users(req.body.userId, req.body.firstName, req.body.lastName, req.body.emailAddress, hash);
                    userArray.push(newUser);
                }
                res.status(201).send(userArray[userArray.length - 1]); //201 created success status
            });
        });
    }
    else {
        res.status(406).send({ message: 'Please enter data in all fields and be sure that email is in the correct format.' });
    }
});
userRouter.patch("/:userId", function (req, res, next) {
    //patch request for 'localhost(3000)/Users/{id}
    if (req.headers.token) { //truthy (if the token exists .. do this:)
        if (validateEmail(req.body.emailAddress) === true) {
            try {
                var tokenPayload = jsonwebtoken_1.default.verify(req.headers.token.toString(), 'vnjdbbviwd');
                if (tokenPayload.userId.toString() === req.params.userId) {
                    var foundUser = findUser(req, res);
                    if (foundUser !== undefined) {
                        foundUser.firstName = req.body.firstName;
                        foundUser.lastName = req.body.lastName;
                        foundUser.emailAddress = req.body.emailAddress;
                        foundUser.password = req.body.password;
                    }
                    res.status(200).send(foundUser);
                }
                else {
                    res.status(401).send({ message: "You can only update this user if you are logged in as this user." });
                }
            }
            catch (ex) { //invalid token
                console.log(ex);
                res.status(401).send({ message: 'Invalid token.' });
            }
        }
        else {
            res.status(406).send({ message: 'Email is not in the correct format.' });
        }
    }
    else {
        res.status(401).send({ message: 'Missing authorization header.' });
    }
});
userRouter.get("/:userId", function (req, res, next) {
    //get request for 'localhost(3000)/Users/{id}
    var foundUser = findUser(req, res);
    if (foundUser)
        res.status(200).send(foundUser);
    else
        res.status(404).send({ message: "User with id " + req.params.userId + " was not found." });
});
userRouter.delete("/:userId", function (req, res, next) {
    //delete request for 'localhost(3000)/Users/{id}
    if (req.headers.token) { //truthy (if the token exists .. do this:)
        try {
            var tokenPayload = jsonwebtoken_1.default.verify(req.headers.token.toString(), 'vnjdbbviwd');
            console.log(tokenPayload);
            if (tokenPayload.userId.toString() === req.params.userId) {
                var user_1 = findUser(req, res);
                if (user_1) {
                    userArray.splice(userArray.findIndex(function (u) { return u.userId === (user_1 === null || user_1 === void 0 ? void 0 : user_1.userId); }), 1);
                    res.status(200).send({ message: "User with id " + req.params.userId + " has been deleted." });
                }
                else {
                    res.status(404).send({ message: "User with id " + req.params.userId + " was not found." });
                }
            }
            else {
                res.status(401).send({ message: "You can only delete this user if you are logged in as this user." });
            }
        }
        catch (ex) { //invalid token
            console.log(ex);
            res.status(401).send({ message: 'Invalid token.' });
        }
    }
    else {
        res.status(401).send({ message: 'Missing authorization header.' });
    }
});
userRouter.get('/Posts/:userId', function (req, res, next) {
    var foundUser = findUser(req, res);
    var userPosts = posts_1.postArray.find(function (u) { return u.userId.toString() === (foundUser === null || foundUser === void 0 ? void 0 : foundUser.userId); });
    if (foundUser)
        res.status(200).send(userPosts);
    else
        res.status(404).send({ message: "User with id " + req.params.userId + " was not found." });
});
userRouter.get('/:userId/:password', function (req, res, next) {
    var user = userArray.find(function (u) { return u.userId.toString() === req.params.userId; });
    if (user != undefined) {
        console.log(req.params.password);
        console.log(user.password.toString());
        bcrypt_1.default.compare(req.params.password, user.password.toString(), function (err, result) {
            // result == true
            if (result) {
                var token = jsonwebtoken_1.default.sign({ userId: user === null || user === void 0 ? void 0 : user.userId, firstName: user === null || user === void 0 ? void 0 : user.firstName }, 'vnjdbbviwd', { expiresIn: 500 });
                res.send({ token: token });
            }
            else {
                res.status(401).send({ message: "Invalid userId and password." });
            }
        });
    }
    else {
        res.status(404).send({ message: "User entered was not found." });
    }
});
function findUser(req, res) {
    var user = userArray.find(function (u) { return u.userId === req.params.userId; });
    if (user !== undefined) {
        return user;
    }
}
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
