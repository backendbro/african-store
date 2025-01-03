"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const User_1 = require("../model/User");
const Register = async (req, res) => {
    const user = await User_1.User.create(req.body);
    console.log(user);
    responseToken(user, 201, res);
};
exports.Register = Register;
const responseToken = (user, statusCode, res) => {
    const token = user.getSignedInJwtToken();
    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };
    res.status(statusCode)
        .cookie('token', token, options)
        .json({ success: true, token });
};
//# sourceMappingURL=Auth.js.map