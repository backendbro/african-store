const { User } = require("../model/User");

exports.Register = async (req, res) => {
  const user = await User.create(req.body);
  console.log(user);
  responseToken(user, 201, res);
};

exports.Login = async (req, res, next) => {
  const { usernameOrEmail, password } = req.body;
  if (!usernameOrEmail || !password) {
    return next(`Please fill in the empty field(s)`);
  }

  let user;
  if (usernameOrEmail.includes("@")) {
    user = await User.findOne({ email: usernameOrEmail }).select("+password");
  } else {
    user = await User.findOne({ username: usernameOrEmail }).select(
      "+password"
    );
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

exports.loggedInUser = async (req, res, next) => {
  res.status(200).json({ success: true, user: req.user });
};

const responseToken = (user, statusCode, res) => {
  //create token
  const token = user.getSignedInJwtToken();

  //jwt options
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false,
  };

  //send the response
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
