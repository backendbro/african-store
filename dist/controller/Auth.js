"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = exports.Register = void 0;
const User_1 = require("../model/User");
const Register = async (req, res) => {
    const user = await User_1.User.create(req.body);
    console.log(user);
    responseToken(user, 201, res);
};
exports.Register = Register;
const Login = async (req, res, next) => {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
        return next(`Please fill in the empty field(s)`);
    }
    let user;
    if (usernameOrEmail.includes("@")) {
        user = await User_1.User.findOne({ email: usernameOrEmail }).select('+password');
    }
    else {
        user = await User_1.User.findOne({ username: usernameOrEmail }).select('+password');
    }
    if (!user) {
        return next(`No account found with this email`);
    }
    console.log(user);
    const iMatch = await user.matchPassword(password);
    if (!iMatch) {
        return next(`Wrong password. Check and try again`);
    }
    responseToken(user, 200, res);
};
exports.Login = Login;
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