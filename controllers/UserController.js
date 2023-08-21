import UserModel from "../models/auth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// Getting User from database

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } else {
      res.status(404).json("USER NOT FOUND :(");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the existing user

export const updateUser = async (req, res) => {
  const id = req.params.id;
  // console.log("Data Received", req.body)
  const { _id, currentUserAdmin, password } = req.body;

  if (id === _id) {
    try {
      // if we also have to update password then password will be bcrypted again
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      // have to change this
      const result = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      const token = jwt.sign(
        { username: result.username, id: result._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log({ result, token });
      res.status(200).json({ result, token });
    } catch (error) {
      console.log("Error agya hy");
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("Access Denied! You can update only your own Account.");
  }
};

// export const updateUser = async (req, res) => {
//   const { id } = req.params;
//   const { currentUserId, password } = req.body;

//   if (id === currentUserId) {
//     try {
//       if (password) {
//         const salt = await bcrypt.genSalt(5);
//         req.body.password = await bcrypt.hash(password, salt);
//       }
//       const user = await UserModel.findByIdAndUpdate(id, req.body, {
//         new: true,
//       });
//       res.status(200).json(user);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   } else {
//     res.status(500).json("You cant update other user details ");
//   }
// };

//Delete the User

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { currentUserId } = req.body;
  if (id === currentUserId) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User Deleted Successfully...");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(500).json("You cant delete others account...");
  }
};

//Follow User

// export const followUser = async (req, res) => {
//   const { id } = req.params;
//   const { currentUserId } = req.body;
//   if (currentUserId === id) {
//     res.status(403).json("You can't follow yoursef ...");
//   } else {
//     try {
//       const userFollowed = await UserModel.findById(id);
//       const userFollowing = await UserModel.findById(currentUserId);
//       if (!userFollowed.followers.includes(userFollowing._id)) {
//         await userFollowed.updateOne({ $push: { followers: currentUserId } });
//         await userFollowing.updateOne({ $push: { following: id } });
//         res.status(200).json(`${userFollowed.username} is followed`);
//       } else {
//         res.status(403).json("You are already following this user...");
//       }
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// };

// //Unfollow the User

// export const unFollowUser = async (req, res) => {
//   const { id } = req.params;
//   const { currentUserId } = req.body;
//   if (currentUserId === id) {
//     res.status(403).json("You can't Unfollow yoursef ...");
//   } else {
//     try {
//       const userUnFollowed = await UserModel.findById(id);
//       const userUnFollowing = await UserModel.findById(currentUserId);
//       if (userUnFollowed.followers.includes(userUnFollowing._id)) {
//         await userUnFollowed.updateOne({ $pull: { followers: currentUserId } });
//         await userUnFollowing.updateOne({ $pull: { following: id } });
//         res.status(200).json(`${userUnFollowed.username} is unfollowed`);
//       } else {
//         res.status(403).json("You are Not following this user to unfollow...");
//       }
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// };

export const getAllUsers = async (req, res) => {
  try {
    let users = await UserModel.find();
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Follow a User
// changed
export const followUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  console.log(id, _id);
  if (_id == id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User followed!");
      } else {
        res.status(403).json("you are already following this id");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
};

// Unfollow a User
// changed
export const unfollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if (_id === id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const unFollowUser = await UserModel.findById(id);
      const unFollowingUser = await UserModel.findById(_id);

      if (unFollowUser.followers.includes(_id)) {
        await unFollowUser.updateOne({ $pull: { followers: _id } });
        await unFollowingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("Unfollowed Successfully!");
      } else {
        res.status(403).json("You are not following this User");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

export const searchUser = async (req, res) => {
  const { q } = req.query;
  try {
    let users = await UserModel.find();
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    const keys = ["firstName", "lastName", "username"];
    const search = (users1) => {
      return users1.filter((user) =>
        keys.some((key) => user[key] && user[key].includes(q))
      );
    };
    res.status(200).json(search(users));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
