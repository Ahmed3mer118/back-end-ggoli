const Users = require("../models/userModel")
const { GROUPED_PERMISSIONS, ALL_PERMISSIONS } = require("../utils/permissions.util")

exports.getUsers = async (req, res) => {
    try {
        const users = new Users()
        // const showData = users.fetchUsers()
        // const hasData = users.keys(req.body).length > 0;
        // if (!hasData) {
        //     return res.status(400).json({ error: "No data provided." });
        // }
        // users.fetchUsers()
        const showData = await Users.find()
        return res.status(200).json({ message: "User retrieved successfully.", data: showData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error while getting User." });
    }
}

exports.getUsersById = async (req, res) => {
    try {
      const id = req.user;
      const user = await Users.findById(id);
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      return res.status(200).json({
        message: "User retrieved successfully.",
        data: user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Server error while getting user.",
      });
    }
  };

exports.updateUserById = async (req,res)=>{
  try{
    const id = req.user._id;
    const { username , phone_number}= req.body
    if(!id){
      return res.status(401).json({ error: "Unauthorized 401" });
    }
    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { username, phone_number },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({
      message: "User updated successfully.",
      data: updatedUser,
    });

  }catch(err){
    return res.status(500).json({ error: "Server error while updating user." });
  }
}

// Admin: update a user's permissions (and optionally role)
exports.updateUserPermissionsByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions, role } = req.body;

    if (!id) {
      return res.status(400).json({ error: "User id is required" });
    }

    const update = {};

    if (permissions !== undefined) {
      if (!Array.isArray(permissions)) {
        return res.status(400).json({ error: "permissions must be an array of strings" });
      }
      update.permissions = permissions;
    }

    if (role !== undefined) {
      const allowedRoles = ["admin", "sub-admin", "user"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }
      update.role = role;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "No changes provided" });
    }

    const updated = await Users.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User permissions updated", user: updated });
  } catch (error) {
    return res.status(500).json({ error: "Server error while updating permissions" });
  }
};

// Admin: get catalog of permissions (grouped and flat)
exports.getPermissionsCatalog = async (req, res) => {
  return res.status(200).json({
    permissions: {
      grouped: GROUPED_PERMISSIONS,
      all: ALL_PERMISSIONS,
    }
  });
};

// Admin: get a user's permissions and role
exports.getUserPermissionsByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id).select('role permissions email username');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Server error while fetching user permissions' });
  }
};
  