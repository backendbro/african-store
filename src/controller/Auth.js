const { User } = require("../model/User");
const { Readable } = require("stream");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dyw5q4fzd",
  api_key: "984224379582864",
  api_secret: "NCiNPkf-HcbVkM13VqZr9lMAaQM",
});

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

// controllers/userController.js

exports.updateProfilePicture = async (req, res) => {
  try {
    // Ensure a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file found" });
    }

    // Assuming your auth middleware has set req.user.id
    const userId = req.user.id;
    const image = req.file; // Multer will place the uploaded file here

    // Function to upload the file buffer to Cloudinary via a stream
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "users/profile" }, // Optional: specify a folder in Cloudinary
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );

        // Convert the buffer to a readable stream and pipe it to Cloudinary
        const bufferStream = new Readable();
        bufferStream.push(fileBuffer);
        bufferStream.push(null); // Indicate the end of the stream
        bufferStream.pipe(stream);
      });
    };

    // Upload the image and get the result from Cloudinary
    const result = await streamUpload(image.buffer);

    // Update the user's profile picture in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: result.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Optionally, you can also update the localStorage on the client-side after a successful response.
    res.status(200).json({
      message: "Profile picture updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating profile picture" });
  }
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
