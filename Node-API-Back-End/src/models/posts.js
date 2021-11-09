"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postArray = exports.Posts = void 0;
var Posts = /** @class */ (function () {
    function Posts(postId, createdDate, title, content, userId, headerImage, lastUpdated) {
        this.postId = postId;
        this.createdDate = createdDate;
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.headerImage = headerImage;
        this.lastUpdated = lastUpdated;
    }
    return Posts;
}());
exports.Posts = Posts;
var postArray = [];
exports.postArray = postArray;
