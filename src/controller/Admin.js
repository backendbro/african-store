const { User } = require("../model/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email } = req.body;

    // Find the user to update
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user's role is admin or owner
    if (user.role !== "admin" && user.role !== "owner") {
      return res.status(403).json({
        error: "Only users with the admin or owner role can be updated",
      });
    }

    // Update allowed fields if provided
    if (username) user.username = username;
    if (email) user.email = email;

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ error: error.message });
  }
};
