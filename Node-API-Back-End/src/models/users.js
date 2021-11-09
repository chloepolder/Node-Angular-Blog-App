"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
var Users = /** @class */ (function () {
    function Users(userId, firstName, lastName, emailAddress, password) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.password = password;
    }
    Users.prototype.toJSON = function () {
        var clone = new Users(this.userId, this.firstName, this.lastName, this.emailAddress, '');
        delete clone.password;
        return clone;
    };
    return Users;
}());
exports.Users = Users;
