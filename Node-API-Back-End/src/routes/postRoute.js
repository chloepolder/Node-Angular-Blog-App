"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
var express_1 = __importDefault(require("express"));
var posts_1 = require("../models/posts");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var postRouter = express_1.default.Router();
exports.postRouter = postRouter;
postRouter.get("/", function (req, res, next) {
    //get request for 'localhost(3000)/Posts/
    //sorted most recent to least recent 
    res.status(200).send(posts_1.postArray.sort(function (a, b) {
        return a.createdDate > b.createdDate ? -1 : a.createdDate < b.createdDate ? 1 : 0;
    }));
});
postRouter.get("/:postId", function (req, res, next) {
    var post = findPost(req, res);
    if (post)
        res.status(200).send(post);
    else
        res.status(404).send({ message: "Post with id " + req.params.postId + " was not found." });
});
postRouter.post("/", function (req, res, next) {
    //post request for 'localhost(3000)/Posts/
    if (req.body.title && req.body.content && req.body.userId && req.body.headerImage) { //if user submitted required fields
        if (req.headers.token) { //truthy (if the token exists .. do this:)
            try {
                var tokenPayload = jsonwebtoken_1.default.verify(req.headers.token.toString(), 'vnjdbbviwd');
                if (tokenPayload.userId === req.body.userId) {
                    //BODY OF REQUEST HERE
                    var today = new Date();
                    var id = 0;
                    if (posts_1.postArray.length !== 0) {
                        id = (posts_1.postArray[posts_1.postArray.length - 1].postId);
                    }
                    posts_1.postArray.push(new posts_1.Posts(++id, today.toISOString().slice(0, 10), req.body.title, req.body.content, req.body.userId, req.body.headerImage, today.toISOString().slice(0, 10)));
                    res.status(201).send(posts_1.postArray[posts_1.postArray.length - 1]); //201 created success status
                }
                else {
                    res.status(401).send({ message: "You can only make a post to this on account if you are logged in as the approprate user." });
                }
            }
            catch (ex) { //invalid token
                res.status(401).send({ message: 'Invalid token.' });
            }
        }
        else {
            res.status(401).send({ message: 'Missing authorization header.' });
        }
    }
    else {
        res.status(406).send({ message: 'Please enter data in the required fields.' });
    }
});
postRouter.patch("/:postId", function (req, res, next) {
    //patch request for 'localhost(3000)/Posts/
    if (req.body.content && req.body.userId && req.body.headerImage) { //if user submitted required fields
        if (req.headers.token) { //truthy (if the token exists .. do this:)
            try {
                var tokenPayload = jsonwebtoken_1.default.verify(req.headers.token.toString(), 'vnjdbbviwd');
                //console.log(tokenPayload);
                if (tokenPayload.userId === req.body.userId) {
                    //BODY OF REQUEST HERE
                    var today = new Date();
                    var foundPost = findPost(req, res);
                    if (foundPost !== undefined) {
                        foundPost.content = req.body.content;
                        foundPost.headerImage = req.body.headerImage;
                        foundPost.lastUpdated = today.toISOString().slice(0, 10);
                    }
                    res.status(200).send(foundPost);
                }
                else {
                    res.status(401).send({ message: "You can only update this post if you are logged in as the appropriate user." });
                }
            }
            catch (ex) { //invalid token
                res.status(401).send({ message: 'Invalid token.' });
            }
        }
        else {
            res.status(401).send({ message: 'Missing authorization header.' });
        }
    }
    else {
        res.status(406).send({ message: 'Please enter data in the required fields.' });
    }
});
postRouter.delete("/:postId", function (req, res, next) {
    //post request for 'localhost(3000)/Posts/
    if (req.headers.token) { //truthy (if the token exists .. do this:)
        try {
            var tokenPayload = jsonwebtoken_1.default.verify(req.headers.token.toString(), 'vnjdbbviwd');
            if (tokenPayload) {
                //BODY OF REQUEST HERE
                var post_1 = findPost(req, res);
                if (post_1) {
                    posts_1.postArray.splice(posts_1.postArray.findIndex(function (u) { return u.postId === (post_1 === null || post_1 === void 0 ? void 0 : post_1.postId); }), 1);
                    res.status(200).send({ message: "Post with id " + req.params.postId + " has been deleted." });
                }
                else {
                    res.status(404).send({ message: "Post with id " + req.params.post + " was not found." });
                }
            }
            else {
                res.status(401).send({ message: "You can only delete this post if you are logged in as the appropriate user." });
            }
        }
        catch (ex) { //invalid token
            res.status(401).send({ message: 'Invalid token.' });
        }
    }
    else {
        res.status(401).send({ message: 'Missing authorization header.' });
    }
});
function findPost(req, res) {
    var post = posts_1.postArray.find(function (u) { return u.postId === +req.params.postId; });
    if (post !== undefined) {
        return post;
    }
}
